package io.xpush.core;

import android.os.Bundle;
import android.widget.Toast;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.internal.BundleJSONConverter;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

import javax.annotation.Nullable;

import io.socket.client.Socket;
import io.socket.emitter.Emitter;

/**
 * Created by james on 2016. 5. 22..
 */
public class XPushModule extends ReactContextBaseJavaModule {


    private static final String REACT_CLASS = "XPushAndroid";

    private static final String CONTEXT_GLOBAL = "global";
    private static final String CONTEXT_CHANNEL = "channel";


    public static final int COMMAND_CONNECT = 100;
    public static final int COMMAND_SEND = 201;

    private ChannelCore mChannelCore;
    private ReactContext mReactContext;


    public XPushModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();
        constants.put(CONTEXT_GLOBAL, "global");
        constants.put(CONTEXT_CHANNEL, "channel");
        return constants;
    }

    private void connectChannel() {

        HashMap<String, Emitter.Listener> events = new HashMap<>();

        events.put(Socket.EVENT_CONNECT_ERROR, onConnectError);
        events.put(Socket.EVENT_CONNECT_TIMEOUT, onConnectError);
        events.put(Socket.EVENT_CONNECT, onConnectSuccess);
        events.put("message", onMessage);

        mChannelCore.connect(events);
    }

    private Emitter.Listener onConnectError = new Emitter.Listener() {
        @Override
        public void call(Object... args) {
            sendEvent(mReactContext, Socket.EVENT_CONNECT_ERROR, null);
        }
    };

    private Emitter.Listener onConnectSuccess = new Emitter.Listener() {
        @Override

        public void call(Object... args) {
            sendEvent(mReactContext, Socket.EVENT_CONNECT, null);
        }
    };

    private void sendEvent(ReactContext reactContext,
                           String eventName,
                           @Nullable WritableMap params) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }

    private Emitter.Listener onMessage = new Emitter.Listener() {
        @Override
        public void call(final Object... args) {
            JSONObject data = (JSONObject) args[0];

            if (data != null) {
                BundleJSONConverter bjc = new BundleJSONConverter();
                Bundle bundle = null;
                try {
                    bundle = bjc.convertToBundle(data);
                } catch (JSONException e) {
                    e.printStackTrace();
                }
                WritableMap map = Arguments.fromBundle(bundle);
                sendEvent(mReactContext, "message", map);
            }
        }
    };

    @ReactMethod
    public void connect(String appId, String mUserId, String mDeviceId, String channelId, String serveUrl, String serverName, Promise promise) {
        mChannelCore = new ChannelCore(appId,  mUserId,  mDeviceId,  channelId,  serveUrl,  serverName);
        connectChannel();
    }

    @ReactMethod
    public void test(){
        System.out.println( " 1111111111 " );
        System.out.println( "TEST TEST TEST" );
    }
}
