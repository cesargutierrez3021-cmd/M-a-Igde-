package com.noah.conductor.alarma

import android.app.KeyguardManager
import android.content.Context
import android.graphics.Color
import android.media.AudioAttributes
import android.media.Ringtone
import android.media.RingtoneManager
import android.os.Build
import android.os.Bundle
import android.os.VibrationEffect
import android.os.Vibrator
import android.view.Gravity
import android.view.WindowManager
import android.widget.Button
import android.widget.LinearLayout
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity

/**
 * La alarma a pantalla completa. Se abre sola incluso con el celular
 * bloqueado (showWhenLocked + turnScreenOn en el manifiesto), suena y
 * vibra hasta que el conductor la descarta.
 */
class AlarmaActivity : AppCompatActivity() {

    private var ringtone: Ringtone? = null
    private var vibrator: Vibrator? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O_MR1) {
            setShowWhenLocked(true)
            setTurnScreenOn(true)
            (getSystemService(Context.KEYGUARD_SERVICE) as KeyguardManager).requestDismissKeyguard(this, null)
        } else {
            @Suppress("DEPRECATION")
            window.addFlags(
                WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED or
                    WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON or
                    WindowManager.LayoutParams.FLAG_DISMISS_KEYGUARD or
                    WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON
            )
        }

        val titulo = intent.getStringExtra("titulo") ?: "NOAH"
        val detalle = intent.getStringExtra("detalle") ?: ""

        setContentView(construirVista(titulo, detalle))
        sonarYVibrar()
    }

    private fun construirVista(titulo: String, detalle: String): LinearLayout {
        val raiz = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            gravity = Gravity.CENTER
            setBackgroundColor(Color.parseColor("#100D08"))
            setPadding(dp(32), dp(32), dp(32), dp(32))
        }

        val kicker = TextView(this).apply {
            text = "N O A H"
            setTextColor(Color.parseColor("#D4AF37"))
            textSize = 13f
            letterSpacing = 0.3f
            gravity = Gravity.CENTER
        }
        val tituloVista = TextView(this).apply {
            text = titulo
            setTextColor(Color.parseColor("#F3EDDD"))
            textSize = 26f
            gravity = Gravity.CENTER
            setPadding(0, dp(20), 0, dp(8))
        }
        val detalleVista = TextView(this).apply {
            text = detalle
            setTextColor(Color.parseColor("#C9BFA6"))
            textSize = 15f
            gravity = Gravity.CENTER
            setPadding(dp(8), 0, dp(8), dp(36))
        }
        val boton = Button(this).apply {
            text = "DESCARTAR"
            setTextColor(Color.parseColor("#14100A"))
            setBackgroundColor(Color.parseColor("#D4AF37"))
            setPadding(dp(24), dp(16), dp(24), dp(16))
            setOnClickListener { finish() }
        }

        raiz.addView(kicker)
        raiz.addView(tituloVista)
        raiz.addView(detalleVista)
        raiz.addView(boton)
        return raiz
    }

    private fun sonarYVibrar() {
        runCatching {
            val uri = RingtoneManager.getActualDefaultRingtoneUri(this, RingtoneManager.TYPE_ALARM)
                ?: RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION)
            ringtone = RingtoneManager.getRingtone(this, uri)
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                ringtone?.audioAttributes = AudioAttributes.Builder()
                    .setUsage(AudioAttributes.USAGE_ALARM)
                    .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                    .build()
            }
            ringtone?.play()
        }
        runCatching {
            vibrator = getSystemService(Context.VIBRATOR_SERVICE) as Vibrator
            val patron = longArrayOf(0, 500, 400)
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                vibrator?.vibrate(VibrationEffect.createWaveform(patron, 0))
            } else {
                @Suppress("DEPRECATION")
                vibrator?.vibrate(patron, 0)
            }
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        ringtone?.stop()
        vibrator?.cancel()
    }

    private fun dp(v: Int): Int = (v * resources.displayMetrics.density).toInt()
}
