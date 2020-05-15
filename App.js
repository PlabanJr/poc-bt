import React, {useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {BleManager} from 'react-native-ble-plx';
import database from '@react-native-firebase/database';

const App = () => {
  // const [devices, setdevices] = useState({});
  const manager = React.useRef();
  manager.current = new BleManager({
    restoreStateIdentifier: 'restoreStateIdentifier',
    restoreStateFunction: () => {},
    allowDuplicate: false,
  });

  useEffect(() => {
    const subscription = manager.current.onStateChange((state) => {
      console.log('>> subscription', state);
      if (state === 'PoweredOn') {
        scanAndConnect();
        subscription.remove();
      }
    }, true);
  }, []);

  const scanAndConnect = () => {
    console.log('>> SCAN');
    manager.current.startDeviceScan(null, null, (error, device) => {
      console.log('>>> device', device);
      if (error) {
        console.log(error, '>> err');
        return;
      }

      if (device) {
        database()
          .ref('/sccannedDevices')
          .update({
            [device.id]: device.id,
          })
          .then(() => console.log('Data set.'))
          .catch((e) => console.log('Error DB', e));
      }

      // Check if it is a device you are looking for based on advertisement data
      // or other criteria.
      // Stop scanning as it's not necessary if you are scanning for one device.
      // manager.current.stopDeviceScan();
      // Proceed with connection.

      // device
      //   .connect()
      //   .then((connectedDevice) => {
      //     return connectedDevice.discoverAllServicesAndCharacteristics();
      //   })
      //   .then((newDevice) => {
      //     // Do work on device with services and characteristics
      //     console.log('>> characteristics', newDevice);
      //   })
      //   .catch((e) => {
      //     console.log('>> err', e);
      //   });
    });
  };

  const search = () => {
    scanAndConnect();
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <Text style={styles.coronaText}>GoCoronaGO</Text>

      <TouchableOpacity onPress={search} style={styles.search}>
        <Text>Search</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  coronaText: {
    fontSize: 40,
  },
  search: {
    width: '80%',
    padding: 10,
    margin: 10,
    alignItems: 'center',
    backgroundColor: '#0779e4',
    borderRadius: 20,
  },
});

export default App;
