package com.noah.conductor;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;
import com.noah.conductor.alarma.AlarmaPantallaPlugin;
import com.noah.conductor.burbuja.BurbujaPlugin;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(BurbujaPlugin.class);
        registerPlugin(AlarmaPantallaPlugin.class);
        super.onCreate(savedInstanceState);
    }
}
