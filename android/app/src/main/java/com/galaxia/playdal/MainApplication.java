package com.galaxia.playdal;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.tavernari.volumecontroller.ReactNativeVolumeControllerPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.lufinkey.react.eventemitter.RNEventEmitterPackage;
import com.lufinkey.react.spotify.RNSpotifyPackage;
import com.polidea.reactnativeble.BlePackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new ReactNativeVolumeControllerPackage(),
            new VectorIconsPackage(),
            new RNEventEmitterPackage(),
            new RNSpotifyPackage(),
            new BlePackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
