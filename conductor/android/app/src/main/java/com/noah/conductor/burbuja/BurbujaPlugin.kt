package com.noah.conductor.burbuja

import android.content.Intent
import android.net.Uri
import android.os.Build
import android.provider.Settings
import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin

/*
 * Puente entre la app web y la burbuja flotante. La burbuja de verdad vive en
 * BurbujaService (una vista dibujada con WindowManager sobre el resto de
 * apps); este plugin solo la enciende, la apaga y le pasa los números.
 */
@CapacitorPlugin(name = "Burbuja")
class BurbujaPlugin : Plugin() {

    companion object {
        // referencia estática: el servicio, que no es un componente de Capacitor,
        // usa esto para avisarle a la web que se tocó la burbuja.
        var instanciaActiva: BurbujaPlugin? = null
    }

    override fun load() {
        super.load()
        instanciaActiva = this
    }

    fun notificarAccion(accion: String) {
        val datos = JSObject()
        datos.put("accion", accion)
        notifyListeners("accion", datos)
    }

    @PluginMethod
    fun tienePermiso(call: PluginCall) {
        val concedido = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            Settings.canDrawOverlays(context)
        } else true
        val r = JSObject()
        r.put("concedido", concedido)
        call.resolve(r)
    }

    @PluginMethod
    fun solicitarPermiso(call: PluginCall) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M && !Settings.canDrawOverlays(context)) {
            val intent = Intent(
                Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                Uri.parse("package:" + context.packageName)
            )
            intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK
            context.startActivity(intent)
        }
        val r = JSObject()
        r.put("concedido", Build.VERSION.SDK_INT < Build.VERSION_CODES.M || Settings.canDrawOverlays(context))
        call.resolve(r)
    }

    @PluginMethod
    fun mostrar(call: PluginCall) {
        val i = Intent(context, BurbujaService::class.java)
        i.action = BurbujaService.ACCION_MOSTRAR
        i.putExtra(BurbujaService.EXTRA_KM, call.getString("km", "0.0"))
        i.putExtra(BurbujaService.EXTRA_TIEMPO, call.getString("tiempo", "0m"))
        i.putExtra(BurbujaService.EXTRA_EN_VIAJE, call.getBoolean("enViaje", false) ?: false)
        context.startForegroundService(i)
        call.resolve()
    }

    @PluginMethod
    fun actualizar(call: PluginCall) {
        val i = Intent(context, BurbujaService::class.java)
        i.action = BurbujaService.ACCION_ACTUALIZAR
        i.putExtra(BurbujaService.EXTRA_KM, call.getString("km", "0.0"))
        i.putExtra(BurbujaService.EXTRA_TIEMPO, call.getString("tiempo", "0m"))
        i.putExtra(BurbujaService.EXTRA_EN_VIAJE, call.getBoolean("enViaje", false) ?: false)
        context.startService(i)
        call.resolve()
    }

    @PluginMethod
    fun ocultar(call: PluginCall) {
        context.stopService(Intent(context, BurbujaService::class.java))
        call.resolve()
    }
}
