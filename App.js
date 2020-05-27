import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
  View,
  SafeAreaView,
} from 'react-native';
import {BleManager} from 'react-native-ble-plx';
import Peripheral, {Service, Characteristic} from 'react-native-peripheral';
import database from '@react-native-firebase/database';
import find from 'lodash/find';

import App_class from './App_class';

const App = () => {
  // // const [devices, setdevices] = useState([]);
  // const manager = React.useRef();
  // const serviceUuid = 'ebed0e09-033a-4bfe-8dcc-20a04fad944e';
  // manager.current = new BleManager({
  //   restoreStateIdentifier: 'restoreStateIdentifier',
  //   restoreStateFunction: () => {},
  //   allowDuplicate: false,
  // });

  // useEffect(() => {
  //   Peripheral.onStateChanged((state) => {
  //     if (state === 'poweredOn') {
  //       Peripheral.addService(
  //         new Service({
  //           // these are just randomly generated UUIDs
  //           uuid: serviceUuid,
  //           characteristics: [
  //             new Characteristic({
  //               uuid: 'c36e1c5a-fc6e-48c8-9a8e-d0b350399d0e',
  //               value: '...',
  //             }),
  //             new Characteristic({
  //               uuid: 'fbc47809-76ce-44fa-a2f0-676b95615472',
  //               onReadRequest: async () => this.state.value,
  //               onWriteRequest: async (value) => this.setState({value}),
  //             }),
  //           ],
  //         }),
  //       ).then(() => {
  //         Peripheral.startAdvertising({
  //           name: 'POC BLE Test GA',
  //           serviceUuids: [serviceUuid],
  //         })
  //           .then(() => console.log('Advertising Success'))
  //           .catch((e) => console.log('Advertising Error', e));
  //       });
  //     }
  //   });

  //   const subscription = manager.current.onStateChange((state) => {
  //     console.log('>> subscription', state);
  //     if (state === 'PoweredOn') {
  //       scanAndConnect();
  //       subscription.remove();
  //     }
  //   }, true);
  // }, []);

  // const scanAndConnect = () => {
  //   console.log('>> SCAN');
  //   manager.current.startDeviceScan(
  //     ['00001809-0000-1000-8000-00805f9b34fb'],
  //     null,
  //     (error, device) => {
  //       console.log('>>> device', device);
  //       if (error) {
  //         console.log(error, '>> err');
  //         return;
  //       }

  //       if (device) {
  //         database()
  //           .ref('/sccannedDevices')
  //           .update({
  //             [device.id]: device.id,
  //           })
  //           .then(() => console.log('Data set.'))
  //           .catch((e) => console.log('Error DB', e));
  //       }

  //       // device
  //       //   .connect()
  //       //   .then((connectedDevice) => {
  //       //     return connectedDevice.discoverAllServicesAndCharacteristics();
  //       //   })
  //       //   .then((newDevice) => {
  //       //     // Do work on device with services and characteristics
  //       //     console.log('>> characteristics', newDevice);
  //       //   })
  //       //   .catch((e) => {
  //       //     console.log('>> err', e);
  //       //   });
  //     },
  //   );
  // };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      {/* <Text style={styles.coronaText}>GoCoronaGO</Text>

      <TouchableOpacity onPress={scanAndConnect} style={styles.search}>
        <Text style={styles.buttonText}>Search</Text>
      </TouchableOpacity> */}

      {/* <View style={styles.listWrapper}>
        <FlatList
          data={devices}
          renderItem={({item, id}) => {
            console.log('>>> item', item.isConnectable);

            return (
              <View style={styles.listItem}>
                <Text style={styles.listItemHead}>ID:</Text>
                <Text>{item.id}</Text>

                <Text style={styles.listItemHead}>isConnectable:</Text>
                <Text>{item.isConnectable ? 'true' : 'false'} </Text>

                <Text style={styles.listItemHead}>NAME:</Text>
                <Text>{item.name} </Text>

                <Text style={styles.listItemHead}>SERVICEUUID: </Text>
                <Text>{item.serviceUUIDs} </Text>
              </View>
            );
          }}
        />
      </View> */}
      <App_class />
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
  buttonText: {
    color: '#fff',
    fontSize: 20,
  },
  search: {
    width: '80%',
    padding: 10,
    margin: 10,
    alignItems: 'center',
    backgroundColor: '#0779e4',
    borderRadius: 20,
  },
  listWrapper: {
    backgroundColor: '#fff',
    flex: 1,
    width: '90%',
    borderRadius: 15,
  },
  listItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    padding: 10,
  },
  listItemHead: {
    color: '#0779e4',
    fontWeight: 'bold',
    marginTop: 5,
  },
});

export default App;
