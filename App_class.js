import React, {Component} from 'react';
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
import DeviceInfo from 'react-native-device-info';

export default class App_class extends Component {
  constructor(props) {
    super(props);
    this.manager = new BleManager({
      restoreStateIdentifier: 'restoreStateIdentifier',
      restoreStateFunction: () => {},
      allowDuplicate: false,
    });
    this.serviceUuid = 'ebed0e09-033a-4bfe-8dcc-20a04fad944e';

    this.state = {
      devices: [],
      advertising: false,
    };

    this.name = null;
    DeviceInfo.getDeviceName().then((res) => {
      console.log(res, '>>> res');
      this.name = res;
    });
  }

  // const [devices, setdevices] = useState([]);

  componentDidMount() {
    const subscription = this.manager.onStateChange((state) => {
      console.log('>> subscription', state);
      if (state === 'PoweredOn') {
        this.scanAndConnect();
        subscription.remove();
      }
    }, true);

    Peripheral.onStateChanged((state) => {
      console.log('>> this.serviceUuid', this.serviceUuid);
      if (state === 'poweredOn') {
        Peripheral.addService(
          new Service({
            // these are just randomly generated UUIDs
            uuid: this.serviceUuid,
            characteristics: [
              new Characteristic({
                uuid: 'c36e1c5a-fc6e-48c8-9a8e-d0b350399d0e',
                value: '...',
              }),
              new Characteristic({
                uuid: 'fbc47809-76ce-44fa-a2f0-676b95615472',
                onReadRequest: async () => this.state.value,
                onWriteRequest: async (value) => this.setState({value}),
              }),
            ],
          }),
        ).then(() => {
          this.startAdvertising();
        });
      }
    });
  }

  startAdvertising = () => {
    console.log('>> Advertising', [this.serviceUuid], this.name);

    Peripheral.startAdvertising({
      name: this.name,
      serviceUuids: [this.serviceUuid],
    })
      .then(() => {
        this.setState({devices: []});
        console.log('Advertising Success');
      })
      .catch((e) => {
        console.log('Advertising Error', e);
        // this.setState({advertising: false});
      });
  };

  scanAndConnect = () => {
    console.log('>> SCAN');
    this.setState({devices: []});
    this.manager.startDeviceScan([this.serviceUuid], null, (error, device) => {
      console.log('>>> device', device);
      if (error) {
        console.log(error, '>> err');
        return;
      }

      if (device) {
        database()
          .ref('/sccannedDevices')
          .update({
            [device.id]: device.name,
          })
          .then(() => console.log('Data set.'))
          .catch((e) => console.log('Error DB', e));

        const isPresent = find(this.state.devices, (device_obj) => {
          return device.id === device_obj.id;
        });

        console.log('>> isPresent', isPresent);

        !isPresent && this.setState({devices: [...this.state.devices, device]});
      }

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

  render() {
    console.log('>> name');

    const {devices, advertising} = this.state;
    console.log(devices, '>> name  ');

    return (
      <SafeAreaView style={styles.safeAreaView}>
        <Text style={styles.coronaText}>GoCoronaGO</Text>

        <TouchableOpacity onPress={this.scanAndConnect} style={styles.search}>
          <Text style={styles.buttonText}>Search</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.startAdvertising} style={styles.search}>
          <Text style={styles.buttonText}>Start Advertising</Text>
        </TouchableOpacity>

        <View style={styles.listWrapper}>
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

                  <Text style={styles.listItemHead}>serviceUuid: </Text>
                  <Text>{item.serviceUuids} </Text>
                </View>
              );
            }}
          />
        </View>
      </SafeAreaView>
    );
  }
}

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
