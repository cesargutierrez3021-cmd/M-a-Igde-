package com.noah.conductor.alarma

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.os.Build
import androidx.core.app.NotificationCompat

/**
 * Dispara cuando llega la hora de una alarma. Publica una notificación de
 * máxima prioridad con un "full-screen intent": si el celular está
 * bloqueado, Android abre AlarmaActivity directamente sobre la pantalla de
 * bloqueo; si está desbloqueado, queda como una notificación normal con la
 * misma pantalla a un toque.
 */
class AlarmaReceiver : BroadcastReceiver() {

    companion object {
        const val CANAL_ID = "noah_alarma"
    }

    override fun onReceive(context: Context, intent: Intent) {
        val id = intent.getStringExtra("id") ?: "noah"
        val titulo = intent.getStringExtra("titulo") ?: "NOAH"
        val detalle = intent.getStringExtra("detalle") ?: ""

        crearCanalSiHaceFalta(context)

        val intentPantalla = Intent(context, AlarmaActivity::class.java).apply {
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP or Intent.FLAG_ACTIVITY_SINGLE_TOP)
            putExtra("titulo", titulo)
            putExtra("detalle", detalle)
        }
        val pendientePantalla = PendingIntent.getActivity(
            context, id.hashCode(), intentPantalla,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val notificacion = NotificationCompat.Builder(context, CANAL_ID)
            .setSmallIcon(com.noah.conductor.R.mipmap.ic_launcher)
            .setContentTitle(titulo)
            .setContentText(detalle)
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setCategory(NotificationCompat.CATEGORY_ALARM)
            .setFullScreenIntent(pendientePantalla, true)
            .setContentIntent(pendientePantalla)
            .setAutoCancel(true)
            .build()

        val nm = context.getSystemService(NotificationManager::class.java)
        nm.notify(id.hashCode(), notificacion)

        // si la app ya está corriendo (o Android permite iniciar la activity), la abrimos directo también
        runCatching { context.startActivity(intentPantalla) }
    }

    private fun crearCanalSiHaceFalta(context: Context) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val nm = context.getSystemService(NotificationManager::class.java)
            if (nm.getNotificationChannel(CANAL_ID) == null) {
                val canal = NotificationChannel(CANAL_ID, "Alarmas", NotificationManager.IMPORTANCE_HIGH)
                canal.enableVibration(true)
                canal.setBypassDnd(true)
                nm.createNotificationChannel(canal)
            }
        }
    }
}
