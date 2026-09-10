package com.noah.conductor.burbuja

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.content.Intent
import android.graphics.Color
import android.graphics.PixelFormat
import android.graphics.drawable.GradientDrawable
import android.os.Build
import android.os.IBinder
import android.view.Gravity
import android.view.MotionEvent
import android.view.View
import android.view.WindowManager
import android.widget.FrameLayout
import android.widget.TextView
import androidx.core.app.NotificationCompat
import com.noah.conductor.MainActivity
import com.noah.conductor.R
import kotlin.math.abs

/**
 * La burbuja flotante: un servicio en primer plano (obligatorio en Android
 * para dibujar sobre el resto de apps de forma sostenida) que mantiene una
 * vista con WindowManager. Un toque corto inicia o termina el viaje: un
 * toque largo abre la app; arrastrarla hacia el borde inferior la cierra.
 */
class BurbujaService : Service() {

    companion object {
        const val ACCION_MOSTRAR = "mostrar"
        const val ACCION_ACTUALIZAR = "actualizar"
        const val EXTRA_KM = "km"
        const val EXTRA_TIEMPO = "tiempo"
        const val EXTRA_EN_VIAJE = "enViaje"
        private const val CANAL_ID = "noah_burbuja"
        private const val NOTIF_ID = 4201
        private const val UMBRAL_TOQUE_MS = 220L
        private const val UMBRAL_ARRASTRE_PX = 12
    }

    private lateinit var windowManager: WindowManager
    private var vistaBurbuja: View? = null
    private lateinit var etiquetaTiempo: TextView
    private lateinit var etiquetaKm: TextView
    private var enViaje = false

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onCreate() {
        super.onCreate()
        windowManager = getSystemService(WINDOW_SERVICE) as WindowManager
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        crearCanalSiHaceFalta()
        startForeground(NOTIF_ID, construirNotificacion())

        val km = intent?.getStringExtra(EXTRA_KM) ?: "0.0"
        val tiempo = intent?.getStringExtra(EXTRA_TIEMPO) ?: "0m"
        enViaje = intent?.getBooleanExtra(EXTRA_EN_VIAJE, false) ?: false

        if (vistaBurbuja == null) crearBurbuja()
        actualizarTextos(km, tiempo)
        return START_STICKY
    }

    override fun onDestroy() {
        super.onDestroy()
        vistaBurbuja?.let { runCatching { windowManager.removeView(it) } }
        vistaBurbuja = null
    }

    private fun crearCanalSiHaceFalta() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val nm = getSystemService(NotificationManager::class.java)
            if (nm.getNotificationChannel(CANAL_ID) == null) {
                nm.createNotificationChannel(
                    NotificationChannel(CANAL_ID, "Jornada activa", NotificationManager.IMPORTANCE_LOW)
                )
            }
        }
    }

    private fun construirNotificacion(): android.app.Notification {
        val abrirApp = PendingIntent.getActivity(
            this, 0, Intent(this, MainActivity::class.java),
            PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT
        )
        return NotificationCompat.Builder(this, CANAL_ID)
            .setContentTitle("NOAH · jornada abierta")
            .setContentText("Toca para volver a la app.")
            .setSmallIcon(R.mipmap.ic_launcher)
            .setContentIntent(abrirApp)
            .setOngoing(true)
            .build()
    }

    private fun crearBurbuja() {
        val tamano = dp(58)
        val contenedor = FrameLayout(this)
        val fondo = GradientDrawable()
        fondo.shape = GradientDrawable.OVAL
        fondo.setColor(Color.parseColor("#14100A"))
        fondo.setStroke(dp(2), Color.parseColor("#D4AF37"))
        contenedor.background = fondo

        etiquetaTiempo = TextView(this).apply {
            setTextColor(Color.parseColor("#F3EDDD"))
            textSize = 12f
            gravity = Gravity.CENTER
        }
        etiquetaKm = TextView(this).apply {
            setTextColor(Color.parseColor("#D4AF37"))
            textSize = 9f
            gravity = Gravity.CENTER
        }

        val columna = android.widget.LinearLayout(this).apply {
            orientation = android.widget.LinearLayout.VERTICAL
            gravity = Gravity.CENTER
            addView(etiquetaTiempo)
            addView(etiquetaKm)
        }
        contenedor.addView(
            columna,
            FrameLayout.LayoutParams(FrameLayout.LayoutParams.WRAP_CONTENT, FrameLayout.LayoutParams.WRAP_CONTENT, Gravity.CENTER)
        )

        val tipoVentana =
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY
            else @Suppress("DEPRECATION") WindowManager.LayoutParams.TYPE_PHONE

        val params = WindowManager.LayoutParams(
            tamano, tamano, tipoVentana,
            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE,
            PixelFormat.TRANSLUCENT
        )
        params.gravity = Gravity.TOP or Gravity.START
        params.x = dp(12)
        params.y = dp(160)

        var xInicial = 0
        var yInicial = 0
        var toqueXInicial = 0f
        var toqueYInicial = 0f
        var tiempoInicioToque = 0L
        var fueArrastre = false

        contenedor.setOnTouchListener { _, evento ->
            when (evento.action) {
                MotionEvent.ACTION_DOWN -> {
                    xInicial = params.x
                    yInicial = params.y
                    toqueXInicial = evento.rawX
                    toqueYInicial = evento.rawY
                    tiempoInicioToque = System.currentTimeMillis()
                    fueArrastre = false
                    true
                }
                MotionEvent.ACTION_MOVE -> {
                    val dx = (evento.rawX - toqueXInicial).toInt()
                    val dy = (evento.rawY - toqueYInicial).toInt()
                    if (abs(dx) > UMBRAL_ARRASTRE_PX || abs(dy) > UMBRAL_ARRASTRE_PX) fueArrastre = true
                    params.x = xInicial + dx
                    params.y = yInicial + dy
                    runCatching { windowManager.updateViewLayout(contenedor, params) }
                    true
                }
                MotionEvent.ACTION_UP -> {
                    val duracion = System.currentTimeMillis() - tiempoInicioToque
                    val metrics = resources.displayMetrics
                    val cercaDelFondo = params.y > metrics.heightPixels - dp(220)
                    when {
                        fueArrastre && cercaDelFondo -> {
                            BurbujaPlugin.instanciaActiva?.notificarAccion("cerrar")
                            stopSelf()
                        }
                        !fueArrastre && duracion >= UMBRAL_TOQUE_MS -> {
                            val abrir = Intent(this, MainActivity::class.java)
                            abrir.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_REORDER_TO_FRONT)
                            startActivity(abrir)
                        }
                        !fueArrastre -> {
                            val accion = if (enViaje) "terminar" else "iniciar"
                            BurbujaPlugin.instanciaActiva?.notificarAccion(accion)
                        }
                    }
                    true
                }
                else -> false
            }
        }

        windowManager.addView(contenedor, params)
        vistaBurbuja = contenedor
    }

    private fun actualizarTextos(km: String, tiempo: String) {
        etiquetaTiempo.text = tiempo
        etiquetaKm.text = "$km km"
    }

    private fun dp(v: Int): Int = (v * resources.displayMetrics.density).toInt()
}
