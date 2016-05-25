package io.xpush.core;

import android.os.Bundle;
import android.widget.Toast;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.internal.BundleJSONConverter;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

import javax.annotation.Nullable;

import io.socket.client.Socket;
import io.socket.client.SocketIOException;
import io.socket.emitter.Emitter;
import io.socket.engineio.client.EngineIOException;

/**
 * Created by james on 2016. 5. 22..
 */
public class XPushModule extends ReactContextBaseJavaModule {


    private static final String REACT_CLASS = "XPushNativeAndroid";

    private static final String CONTEXT_GLOBAL = "global";
    private static final String CONTEXT_CHANNEL = "channel";


    public static final int COMMAND_CONNECT = 100;
    public static final int COMMAND_SEND = 201;

    private ChannelCore mChannelCore;
    private ReactContext mReactContext;
    private Promise connectionPromise;
    private Callback connectionCallback;

    private String mAppId;
    private String mUserId;
    private String mDeviceId;

    public XPushModule(ReactApplicationContext reactContext) {
        super(reactContext);
        mReactContext = reactContext;
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
            System.out.println(Socket.EVENT_CONNECT_ERROR);
            if( args[0] instanceof SocketIOException) {
                SocketIOException e = (SocketIOException) args[0];
                //connectionPromise.reject(e);
                connectionCallback.invoke("error");
            } else if ( args[0] instanceof  EngineIOException){
                EngineIOException e = (EngineIOException) args[0];
                //connectionPromise.reject(e);
                connectionCallback.invoke("error");
            }

            //sendEvent(mReactContext, Socket.EVENT_CONNECT_ERROR, null);
        }
    };

    private Emitter.Listener onConnectSuccess = new Emitter.Listener() {
        @Override

        public void call(Object... args) {
            //System.out.println(Socket.EVENT_CONNECT );
            //sendEvent(mReactContext, Socket.EVENT_CONNECT, null);
            //connectionPromise.resolve("success");
            connectionCallback.invoke("success");
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
                sendEvent(mReactContext, "onMessage", map);
            }
        }
    };

    @ReactMethod
    public void init(String appId, String userId, String deviceId) {
        this.mAppId = appId;
        this.mUserId = userId;
        this.mDeviceId = deviceId;
    }

    @ReactMethod
    public void connect(ReadableMap map, Callback callback) {
        mChannelCore = new ChannelCore(mAppId,  mUserId,  mDeviceId, map.getString("C"), map.getString("URL"), map.getString("S") );
        connectionCallback = callback;
        connectChannel();
    }

    @ReactMethod
    public void test(){
        System.out.println("TEST");
    }

    @ReactMethod
    public void send(String message){
        if( mChannelCore != null ){
            mChannelCore.sendMessage(message);
        }
    }
}