
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Linking,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import DropDownPicker from 'react-native-dropdown-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function Booking({ navigation, route }) {
  const { room, roomType, userRole, userName } = route.params || {};
  const [phone, setPhone] = useState('');
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);
  const [rooms, setRooms] = useState(1);
  const [adults, setAdults] = useState('');
  const [children, setChildren] = useState('');
  const [specialRequest, setSpecialRequest] = useState('');

  // Dropdown setup
  const [openRooms, setOpenRooms] = useState(false);
  const roomItems = Array.from({ length: 10 }, (_, i) => ({
    label: `${i + 1}`,
    value: i + 1,
  }));

  // Timer state
  const [timer, setTimer] = useState(0); // seconds
  const [bookingActive, setBookingActive] = useState(false);
  const [paid, setPaid] = useState(false);
  const timerRef = useRef(null);

  // Payment Modal state
  const [modalVisible, setModalVisible] = useState(false);

  // Validate Pakistani number
  const validatePhone = (number) => /^(\+92|0)3[0-9]{9}$/.test(number);

  // Handle Booking
  const handleSubmit = () => {
    if (!validatePhone(phone)) {
      Alert.alert('Invalid Phone', 'Please enter a valid Pakistani phone number.');
      return;
    }

    const maxAdults = rooms * 2;
    const maxChildren = rooms * 2;
    if ((adults && parseInt(adults) > maxAdults) || (children && parseInt(children) > maxChildren)) {
      Alert.alert(
        'Guest Limit Exceeded',
        `For ${rooms} room(s), maximum ${maxAdults} adults and ${maxChildren} children allowed.`
      );
      return;
    }

    Alert.alert(
      'Booking Successful!',
      'You have 15 minutes to complete payment, otherwise your booking will be cancelled automatically.'
    );

    setBookingActive(true);
    setTimer(15 * 60); // 15 minutes = 900 seconds
  };

  // Timer countdown
  useEffect(() => {
    if (timer > 0 && bookingActive && !paid) {
      timerRef.current = setTimeout(() => setTimer(timer - 1), 1000);
    } else if (timer === 0 && bookingActive && !paid) {
      handleCancelBooking();
    }
    return () => clearTimeout(timerRef.current);
  }, [timer, bookingActive, paid]);

  const handleCancelBooking = () => {
    clearTimeout(timerRef.current);
    setBookingActive(false);
    setPaid(false);
    setTimer(0);
    Alert.alert('Booking Cancelled', 'Your booking has been cancelled.');
  };

  const handleMarkPaid = () => {
    clearTimeout(timerRef.current);
    setPaid(true);
    setModalVisible(false);
    Alert.alert('Payment Successful', 'Your booking has been confirmed. Enjoy your stay!');
  };

  // Format mm:ss
  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const paymentApps = [
  {
    name: 'Easypaisa',
    uris: ['easypaisa://', 'telenoreasypaisa://'],
    package: 'pk.com.telenor.phoenix',
    playStore: 'https://play.google.com/store/apps/details?id=pk.com.telenor.phoenix',
    appStore: 'https://apps.apple.com/us/app/easypaisa-a-digital-bank/id1227725092'
  },
  {
    name: 'JazzCash',
    uris: ['jazzcash://'],
    package: 'com.techlogix.mobilinkcustomer',
    playStore: 'https://play.google.com/store/apps/details?id=com.techlogix.mobilinkcustomer',
    appStore: 'https://apps.apple.com/us/app/jazzcash-your-mobile-account/id1224617688'
  },
  {
    name: 'Meezan Bank',
    uris: ['meezanbank://'],
    package: 'invo8.meezan.mb',
    playStore: 'https://play.google.com/store/apps/details?id=invo8.meezan.mb',
    appStore: 'https://apps.apple.com/us/app/meezan-mobile-app/id1609237715'
  },
  {
    name: 'HBL Mobile',
    uris: ['hblmobilebanking://'],
    package: 'com.hbl.android.hblmobilebanking',
    playStore: 'https://play.google.com/store/apps/details?id=com.hbl.android.hblmobilebanking',
    appStore: 'https://apps.apple.com/gb/app/hbl-mobile/id1123585628'
  },
  {
    name: 'UBL Digital',
    uris: ['ubldigital://'],
    package: 'app.com.brd',
    playStore: 'https://play.google.com/store/apps/details?id=app.com.brd',
    appStore: 'https://apps.apple.com/us/app/ubl-digital-safe-banking/id1203678041'
  },
  {
    name: 'Bank Alfalah – ALFA',
    uris: ['alfalahdigital://'],
    package: 'com.base.bankalfalah',
    playStore: 'https://play.google.com/store/apps/details?id=com.base.bankalfalah',
    appStore: 'https://apps.apple.com/pk/app/alfa-bank-alfalah/id1279126674'
  },
  {
    name: 'NBP Digital',
    uris: ['nbpdigital://'],
    package: 'com.paysys.nbpdigital',
    playStore: 'https://play.google.com/store/apps/details?id=com.paysys.nbpdigital',
    appStore: 'https://apps.apple.com/us/app/nbp-digital/id1261340473'
  },
  {
    name: 'SC Mobile Pakistan',
    uris: ['scbmw://'],
    package: 'com.scb.pk.bmw',
    playStore: 'https://play.google.com/store/apps/details?id=com.scb.pk.bmw',
    appStore: 'https://apps.apple.com/pk/app/sc-mobile-pakistan/id645859445'
  },
  {
    name: 'HabibMetro Mobile Banking',
    uris: ['habibmetro://'],
    package: 'com.avanza.ambitwizhmb',
    playStore: 'https://play.google.com/store/apps/details?id=com.avanza.ambitwizhmb',
    appStore: 'https://apps.apple.com/us/app/habibmetro-insta-mobile-app/id1358678078'
  },
  {
    name: 'Bank Al Habib NetBanking',
    uris: ['bankalhabib://'],
    package: 'com.ofss.digx.mobile.obdx.bahl',
    playStore: 'https://play.google.com/store/apps/details?id=com.ofss.digx.mobile.obdx.bahl',
    appStore: 'https://apps.apple.com/pk/app/al-habib-mobile/id1129804925'
  },
  {
    name: 'MCB Mobile',
    uris: ['mcbmobile://'],
    package: 'com.mcb.mcblive',
    playStore: 'https://play.google.com/store/apps/details?id=com.mcb.mcblive',
    appStore: 'https://apps.apple.com/us/app/mcb-live/id1584933248'
  },
  {
    name: 'Askari Bank',
    uris: ['askaribank://'],
    package: 'com.askari',
    playStore: 'https://play.google.com/store/apps/details?id=com.askari',
    appStore: 'https://apps.apple.com/us/app/askari-mobile-app/id1069347347'
  },
  {
    name: 'Allied Bank',
    uris: ['abl://'],
    package: 'com.ofss.digx.mobile.android.allied',
    playStore: 'https://play.google.com/store/apps/details?id=com.ofss.digx.mobile.android.allied',
    appStore: 'https://apps.apple.com/us/app/myabl-wallet/id1455479217'
  },
  {
    name: 'Faysal Bank',
    uris: ['fbl://'],
    package: 'com.avanza.ambitwizfbl',
    playStore: 'https://play.google.com/store/apps/details?id=com.avanza.ambitwizfbl',
    appStore: 'https://apps.apple.com/pk/app/faysal-digibank/id1459836486'
  },
  {
    name: 'Dubai Islamic Bank',
    uris: ['dib://'],
    package: 'com.dib.app',
    playStore: 'https://play.google.com/store/apps/details?id=com.dib.app',
    appStore: 'https://apps.apple.com/us/app/dib-alt-mobile-banking-app/id739758144'
  },
  {
    name: 'JS Bank',
    uris: ['jsb://'],
    package: 'com.JSBL.bank',
    playStore: 'https://play.google.com/store/apps/details?id=com.JSBL.bank',
    appStore: 'https://apps.apple.com/us/app/js-mobile/id1561630920'
  },
  {
    name: 'Bank of Punjab',
    uris: ['bop://'],
    package: 'com.digibop.mobile',
    playStore: 'https://play.google.com/store/apps/details?id=com.digibop.mobile',
    appStore: 'https://apps.apple.com/us/app/digibop-simple-speedy-secure/id1633409681'
  },
  {
    name: 'First Women Bank',
    uris: ['fwbl://'],
    package: 'com.avanza.digitalfwbl',
    playStore: 'https://play.google.com/store/apps/details?id=com.avanza.digitalfwbl',
    appStore: 'https://apps.apple.com/us/app/fwbl-digital/id1540074400'
  },
  {
    name: 'Sindh Bank',
    uris: ['sindhbank://'],
    package: 'com.avanza.sindhbanklimited',
    playStore: 'https://play.google.com/store/apps/details?id=com.avanza.sindhbanklimited',
    appStore: 'https://apps.apple.com/us/app/sindhbank/id1583214157'
  },
  {
    name: 'Soneri Bank',
    uris: ['soneribank://'],
    package: 'com.p3.soneridigital',
    playStore: 'https://play.google.com/store/apps/details?id=com.p3.soneridigital',
    appStore: 'https://apps.apple.com/us/app/soneribank/id1583214157'
  },
  {
    name: 'Bank Islami',
    uris: ['bankislami://'],
    package: 'com.bi.digitalbanking',
    playStore: 'https://play.google.com/store/apps/details?id=com.bi.digitalbanking',
    appStore: 'https://apps.apple.com/us/app/bankislami/id6717596631'
  },
  {
    name: 'Bank of Khyber',
    uris: ['bok://'],
    package: 'com.temenos.bok',
    playStore: 'https://play.google.com/store/apps/details?id=com.temenos.bok',
    appStore: 'https://apps.apple.com/in/app/bok-bank-of-khyber/id1523016191'
  },
  {
    name: 'NayaPay',
    uris: ['nayapay://'],
    package: 'com.nayapay.app',
    playStore: 'https://play.google.com/store/apps/details?id=com.nayapay.app',
    appStore: 'https://apps.apple.com/us/app/nayapay/id1621286305'
  },
  {
    name: 'SadaPay',
    uris: ['sadapay://'],
    package: 'com.sadapay.app',
    playStore: 'https://play.google.com/store/apps/details?id=com.sadapay.app',
    appStore: 'https://apps.apple.com/us/app/sadapay-money-made-simple/id1543848524'
  },
];

//   const paymentApps = [
//   {
//     name: 'Easypaisa',
//     uris: ['easypaisa://', 'easypaisa://home', 'telenoreasypaisa://'],
//     package: 'pk.com.telenor.phoenix',
//     playStore: 'https://play.google.com/store/apps/details?id=pk.com.telenor.phoenix&hl=en-GB',
//     appStore: 'https://apps.apple.com/us/app/easypaisa-a-digital-bank/id1227725092'
//   },
//   {
//     name: 'JazzCash',
//     uris: ['jazzcash://', 'jazzcashapp://'],
//     package: 'com.jazzcash.wallet',
//     playStore: 'https://play.google.com/store/apps/details?id=com.techlogix.mobilinkcustomer&hl=en-US',
//     appStore: 'https://apps.apple.com/us/app/jazzcash-your-mobile-account/id1224617688'
//   },
//   {
//     name: 'Meezan Bank',
//     uris: ['meezanbank://', 'meezan://'],
//     package: 'com.meezanbank.mapp',
//     playStore: 'https://play.google.com/store/apps/details?id=invo8.meezan.mb&hl=en-US',
//     appStore: 'https://apps.apple.com/us/app/meezan-mobile-app/id1609237715'
//   },
//   {
//     name: 'HBL Mobile',
//     uris: ['hblmobilebanking://', 'hbl://'],
//     package: 'com.hbl.android.bank',
//     playStore: 'https://play.google.com/store/apps/details?id=com.hbl.android.hblmobilebanking&hl=en-US',
//     appStore: 'https://apps.apple.com/gb/app/hbl-mobile/id1123585628'
//   },
//   {
//     name: 'UBL Digital',
//     uris: ['ubldigital://', 'ubl://'],
//     package: 'com.innovate.ublinsight',
//     playStore: 'https://play.google.com/store/apps/details?id=app.com.brd&hl=en-US',
//     appStore: 'https://apps.apple.com/us/app/ubl-digital-safe-banking/id1203678041'
//   },
//   {
//     name: 'Bank Alfalah – ALFA',
//     uris: ['alfalahdigital://', 'omni://'],
//     package: 'com.bankalfalah.omni',
//     playStore: 'https://play.google.com/store/apps/details?id=com.base.bankalfalah&hl=en',
//     appStore: 'https://apps.apple.com/us/app/nbp-digital/id1261340473'
//   },
//   {
//     name: 'NBP Digital',
//     uris: ['nbpdigital://', 'nbp://'],
//     package: 'com.paysys.nbpdigital',
//     playStore: 'https://play.google.com/store/apps/details?id=com.paysys.nbpdigital&hl=en',
//     appStore: 'https://apps.apple.com/us/app/nbp-digital/id1261340473'
//   },
//   {
//     name: 'SC Mobile Pakistan',
//     uris: ['scbmw://', 'scbpk://'],
//     package: 'com.scb.pk.bmw',
//     playStore: 'https://play.google.com/store/apps/details?id=com.scb.pk.bmw&hl=en',
//     appStore: 'https://apps.apple.com/ba/app/sc-mobile-pakistan/id645859445'
//   },
//   {
//     name: 'HabibMetro Mobile Banking',
//     uris: ['habibmetro://', 'hmbl://'],
//     package: 'com.hmbl.mobilebanking',
//     playStore: 'https://play.google.com/store/apps/details?id=com.avanza.ambitwizhmb&hl=en',
//     appStore: 'https://apps.apple.com/us/app/habibmetro-insta-mobile-app/id1358678078'  // note: example placeholder
//   },
//   {
//     name: 'Bank Al Habib NetBanking',
//     uris: ['bahnet://', 'bankalhabib://'],
//     package: 'com.bankalhabib.mobile',
//     playStore: 'https://play.google.com/store/apps/details?id=com.ofss.digx.mobile.obdx.bahl&hl=en-US',
//     appStore: 'https://www.bankalhabib.com/alhabib-mobile'  // placeholder
//   },
//   {
//     name: 'MCB Lite / MCB Mobile',
//     uris: ['mcblite://', 'mcbmobile://'],
//     package: 'com.mcb.mobilebanking',
//     playStore: 'https://play.google.com/store/apps/details?id=com.mcb.mcblive&hl=en-US',
//     appStore: 'https://apps.apple.com/us/app/mcb-live/id1584933248'
//   },
//   {
//    name: 'Samba Bank Limited',
//    uris: ['samba bank limited://', 'sbl://'],
//    package: 'com.sambabanklimited',
//    playStore: 'https://play.google.com/store/apps/details?id=com.mobile.samba&hl=en-US',
//    appStore:   'https://apps.apple.com/us/app/samba-mobile-banking/id6480302141'
//   },
//   {
//     name: 'askari bank',
//     uris: ['askari bank ://', 'askari bank'],
//     package: 'com.askaribank digital',
//     playStore: 'https://play.google.com/store/apps/details?id=com.askari&hl=en',
//     appStore:  'https://apps.apple.com/us/app/askari-mobile-app/id1069347347'
//   },
//   {
//     name: 'Allied Bank ',
//     uris: ['allied bank://', 'abl'],
//     package: 'com.alliedbanklimited',
//     playStore: 'https://play.google.com/store/apps/details?id=com.ofss.digx.mobile.android.allied&hl=en',
//     appStore:  'https://apps.apple.com/us/app/myabl-wallet/id1455479217'
//   },
//   {
//     name: 'Faysal Bank',
//     uris: ['faysal bank//', 'fbl'],
//     package: 'com.faysalbank',
//     playStore: 'https://play.google.com/store/apps/details?id=com.avanza.ambitwizfbl&hl=en',
//     appStore:   'https://apps.apple.com/pk/app/faysal-digibank/id1459836486?platform=iphone'
//   },
//   {
//     name: 'Dubai Islamic Bank',
//     uris: ['dubai islamic bank//','dib'],
//     package: 'com.dubaiislamicbank',
//     playStore: 'https://play.google.com/store/apps/details?id=com.dib.app&hl=en-US',
//     appStore:  'https://apps.apple.com/us/app/dib-alt-mobile-banking-app/id739758144'
//   },
//   {
//     name: 'JS Bank',
//     uris: ['js bank//', 'jsb'],
//     package: 'com.jsbank',
//     playStore: 'https://play.google.com/store/apps/details?id=com.JSBL.bank&hl=en-US',
//     appStore: 'https://apps.apple.com/us/app/js-mobile/id1561630920'
//   },
//   {
//      name: 'Standard Chartered Bank',
//     uris: ['standard chartered bank//','scb'],
//     package: 'com.standardcharteredbank',
//     playStore: 'https://play.google.com/store/apps/developer?id=Standard+Chartered+Bank+PLC&hl=en-US',
//     appStore: 'https://apps.apple.com/us/developer/standard-chartered-bank/id367337301'
//   },
//   {
//      name: 'Bank Of Punjab',
//     uris: ['bank of punjab//','bop'],
//     package: 'com.bankofpunjab',
//     playStore: 'https://play.google.com/store/apps/details?id=com.digibop.mobile&hl=en',
//     appStore: 'https://apps.apple.com/us/app/digibop-simple-speedy-secure/id1633409681'
//   },
//   {
//      name: 'First Women Bank Limited',
//     uris: ['first women bank limited//','fwbl'],
//     package: 'com.firstwomenbanklimited',
//     playStore: 'https://play.google.com/store/apps/details?id=com.avanza.digitalfwbl&hl=en-US',
//     appStore:  'https://apps.apple.com/us/app/fwbl-digital/id1540074400'
//   },
//   {
//      name: 'Sindh Bank',
//     uris: ['sindh bank//','sbl'],
//     package: 'com.sindhbank',
//     playStore: 'https://play.google.com/store/apps/details?id=com.avanza.sindhbanklimited&hl=en',
//     appStore: 'https://apps.apple.com/us/app/sindhbank/id1583214157'
//   },
//   {
//     name: 'Soneri bank',
//     uris:['soneri babnk//','sb'],
//     package: 'com.soneribank',
//     playStore: 'https://play.google.com/store/apps/details?id=com.p3.soneridigital&hl=en-US',
//     appStore:  'https://apps.apple.com/us/developer/soneri-bank-limited/id1121130868'
//   },
//   {
//     name: 'Bank Islami Pakistan Limited',
//     uris:['bank islami pakistan limited//','bipl'],
//     package: 'com.bankislamipakistanlimited',
//     playStore: 'https://play.google.com/store/apps/details?id=com.bi.digitalbanking&hl=en',
//     appStore: 'https://apps.apple.com/us/app/bankislami/id6717596631'
//   },
//   {
//     name: 'AL Baraka Bank Pakistan',
//     uris:['al baraka bank pakistan//','abbp'],
//     package: 'com.albarakabankpakistan',
//     playStore: 'https://play.google.com/store/apps/details?id=pk.com.albaraka.mobileapp&hl=en',
//     appStore: 'https://apps.apple.com/pk/app/al-baraka-bank-pakistan/id1290819715'
//   },
//   {
//     name: 'Bank Islami',
//     uris:['bank islami//','bi'],
//     package: 'com.bankislami',
//     playStore: 'https://play.google.com/store/apps/details?id=com.bi.digitalbanking&hl=en',
//     appStore: 'https://apps.apple.com/us/app/bankislami/id6717596631'
//   },
//   {
//     name: 'Bank Of Khyber',
//     uris:['bank of khyber//','bok'],
//     package: 'com.bankofkhyber',
//     playStore: 'https://play.google.com/store/apps/details?id=com.temenos.bok&hl=en-US',
//     appStore: 'https://apps.apple.com/in/app/bok-bank-of-khyber/id1523016191'
//   },
//   {
//     name: 'Deutsche Bank',
//     uris:['deutsche bank//','db'],
//     package: 'com.deutschebank',
//     playStore: 'https://play.google.com/store/apps/details?id=com.db.pwcc.dbmobile&hl=en-US',
//     appStore: 'https://apps.apple.com/us/app/deutsche-bank/id1040475847'
//   },
//   {
//     name: 'Nayapay',
//     uris:['nayapay//','np'],
//     package: 'com.nayapay',
//     playStore: 'https://play.google.com/store/apps/details?id=com.nayapay.app&hl=en-US',
//     appStore: 'https://apps.apple.com/us/app/nayapay/id1621286305'
//   },
//   {
//     name: 'Sadapay',
//     uris:['sadapay//','sp'],
//     package: 'com.sadapay',
//     playStore: 'https://play.google.com/store/apps/details?id=com.sadapay.app&hl=en-US',
//     appStore: 'https://apps.apple.com/us/app/sadapay-money-made-simple/id1543848524'
//   },
//   // you can add more as needed
// ];

  const openPaymentApp = async (app) => {
    setModalVisible(false);

    // 1) Try each scheme first
    for (const uri of app.uris) {
      try {
        const can = await Linking.canOpenURL(uri);
        if (can) {
          await Linking.openURL(uri);
          // Give user time in app to do payment, then simulate confirmation (or you can integrate actual callback)
          // we simulate success after a short delay
          setTimeout(() => {
            Alert.alert(
              'Returned from Payment App',
              `If you completed payment in ${app.name}, tap Confirm.`,
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Confirm', onPress: handleMarkPaid }
              ]
            );
          }, 1500);
          return;
        }
      } catch (err) {
        // ignore and try next scheme
      }
    }

    // 2) Android: try intent to open package (works when URI schemes fail)
    if (Platform.OS === 'android' && app.package) {
      try {
        // intent://intent to open by package - some apps accept this
        const intentUrl = `intent://#Intent;package=${app.package};end`;
        const canIntent = await Linking.canOpenURL(intentUrl);
        if (canIntent) {
          await Linking.openURL(intentUrl);
          setTimeout(() => {
            Alert.alert(
              'Returned from Payment App',
              `If you completed payment in ${app.name}, tap Confirm.`,
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Confirm', onPress: handleMarkPaid }
              ]
            );
          }, 1500);
          return;
        }
      } catch (err) {
        // ignore and move to fallback
      }
    }

    // 3) Not installed or cannot open: ask to download from store
    Alert.alert(
      `${app.name} Not Found`,
      `${app.name} does not appear to be installed or cannot be opened on this device. Would you like to download it from the store?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Open Store',
          onPress: async () => {
            try {
              const storeUrl = Platform.OS === 'android' ? app.playStore : app.appStore;
              if (storeUrl) await Linking.openURL(storeUrl);
            } catch (err) {
              Alert.alert('Error', 'Unable to open store link.');
            }
          }
        }
      ]
    );
  };

  // Simulate payment (for testing when deep linking doesn't work)
  const simulatePayment = () => {
    Alert.alert(
      'Simulate Payment',
      'Since payment app integration might not work in development, you can simulate successful payment.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Mark as Paid', onPress: handleMarkPaid }
      ]
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Room Booking</Text>
        </View>

        {/* Phone Number */}
        <TextInput
          style={styles.input}
          placeholder="Enter Pakistani Phone (+92 or 03...)"
          placeholderTextColor="#666"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />

        {/* Dates */}
        <TouchableOpacity style={styles.datePicker} onPress={() => setShowFromPicker(true)}>
          <Icon name="event" size={20} color="#a0855c" style={styles.dateIcon} />
          <Text style={styles.dateText}>From: {fromDate.toLocaleDateString('en-GB')}</Text>
        </TouchableOpacity>
        {showFromPicker && (
          <DateTimePicker
            value={fromDate}
            mode="date"
            display="default"
            onChange={(e, date) => {
              setShowFromPicker(false);
              if (date) setFromDate(date);
            }}
          />
        )}

        <TouchableOpacity style={styles.datePicker} onPress={() => setShowToPicker(true)}>
          <Icon name="event" size={20} color="#a0855c" style={styles.dateIcon} />
          <Text style={styles.dateText}>To: {toDate.toLocaleDateString('en-GB')}</Text>
        </TouchableOpacity>
        {showToPicker && (
          <DateTimePicker
            value={toDate}
            mode="date"
            display="default"
            onChange={(e, date) => {
              setShowToPicker(false);
              if (date) setToDate(date);
            }}
          />
        )}

        {/* Room Dropdown */}
        <Text style={styles.label}>Number of Rooms</Text>
        <DropDownPicker
          open={openRooms}
          value={rooms}
          items={roomItems}
          setOpen={setOpenRooms}
          setValue={setRooms}
          placeholder="Select number of rooms"
          style={styles.dropdown}
          textStyle={styles.dropdownText}
          dropDownContainerStyle={styles.dropdownContainer}
          zIndex={3000}
          zIndexInverse={1000}
        />

        {/* Adults / Children */}
        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.halfInput]}
            placeholder="Adults"
            placeholderTextColor="#666"
            keyboardType="numeric"
            value={adults}
            onChangeText={setAdults}
          />
          <TextInput
            style={[styles.input, styles.halfInput]}
            placeholder="Children"
            placeholderTextColor="#666"
            keyboardType="numeric"
            value={children}
            onChangeText={setChildren}
          />
        </View>

        {/* Special Request */}
        <Text style={styles.label}>Special Request</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Any special requests?"
          placeholderTextColor="#666"
          multiline
          numberOfLines={4}
          value={specialRequest}
          onChangeText={setSpecialRequest}
        />

        {/* Submit Button */}
        {!bookingActive && !paid && (
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitText}>Submit Booking & Pay Now</Text>
          </TouchableOpacity>
        )}

        {/* Timer Section */}
        {bookingActive && !paid && (
          <View style={styles.timerBox}>
            <Text style={styles.timerText}>
              Payment expires in: <Text style={styles.timerCount}>{formatTime(timer)}</Text>
            </Text>
            <TouchableOpacity style={styles.payButton} onPress={() => setModalVisible(true)}>
              <Text style={styles.payText}>Pay Now</Text>
            </TouchableOpacity>

            {/* Cancel Booking Button */}
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancelBooking}>
              <Text style={styles.cancelText}>Cancel Booking</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Payment Modal */}
        <Modal visible={modalVisible} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Choose Payment Method</Text>

              {/* Simulation Option for Development */}
              <TouchableOpacity
                style={[styles.paymentOption, styles.simulationOption]}
                onPress={simulatePayment}
              >
                <Icon name="build" size={24} color="#a0855c" />
                <Text style={styles.paymentText}>Simulate Payment (Testing)</Text>
              </TouchableOpacity>

              <ScrollView style={styles.paymentScrollView}>
                {paymentApps.map((app, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.paymentOption}
                    onPress={() => openPaymentApp(app)}
                  >
                    <Icon name="account-balance-wallet" size={22} color="#a0855c" />
                    <Text style={styles.paymentText}>{app.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Payment Complete */}
        {paid && (
          <View style={styles.confirmBox}>
            <Text style={styles.confirmText}>✅ Booking Confirmed & Payment Received</Text>

            {/* Cancel Booking Button for confirmed booking */}
            <TouchableOpacity style={styles.cancelButtonSmall} onPress={handleCancelBooking}>
              <Text style={styles.cancelTextSmall}>Cancel Booking</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// --- Styles (same as your earlier styles) ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f3eb' },
  contentContainer: { padding: 16, paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, marginTop: 10 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#000', marginLeft: 10 },
  input: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 16,
    fontSize: 16,
    color: '#000',
  },
  datePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 14,
    marginBottom: 16,
  },
  dateIcon: { marginRight: 10 },
  dateText: { color: '#333', fontSize: 16 },
  label: { fontSize: 14, color: '#333', marginBottom: 6, fontWeight: '600' },
  dropdown: { backgroundColor: '#fff', borderColor: '#ddd', marginBottom: 16 },
  dropdownText: { color: '#333' },
  dropdownContainer: { backgroundColor: '#fff', borderColor: '#ddd' },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  halfInput: { width: '48%' },
  textArea: {
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    padding: 14,
    textAlignVertical: 'top',
    color: '#000',
    fontSize: 16,
    marginBottom: 20,
  },
  submitButton: { backgroundColor: '#a0855c', padding: 16, borderRadius: 10, alignItems: 'center' },
  submitText: { color: '#fff', fontSize: 17, fontWeight: 'bold' },
  timerBox: {
    backgroundColor: '#fff8f0',
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#a0855c',
    alignItems: 'center',
    marginTop: 20,
  },
  timerText: { color: '#333', fontSize: 16, marginBottom: 10 },
  timerCount: { color: '#b36b00', fontWeight: 'bold' },
  payButton: {
    backgroundColor: '#a0855c',
    padding: 12,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
    marginBottom: 10,
  },
  payText: { color: '#fff', fontWeight: 'bold' },
  cancelButton: {
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ff6b6b',
    width: '60%',
    alignItems: 'center',
  },
  cancelText: { color: '#ff6b6b', fontWeight: 'bold' },
  cancelButtonSmall: {
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ff6b6b',
    alignItems: 'center',
    marginTop: 10,
    alignSelf: 'center',
  },
  cancelTextSmall: { color: '#ff6b6b', fontWeight: 'bold', fontSize: 14 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContainer: { width: '85%', backgroundColor: '#fff', borderRadius: 15, padding: 20, maxHeight: '70%' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#a0855c', textAlign: 'center', marginBottom: 20 },
  paymentScrollView: { maxHeight: 300 },
  paymentOption: { flexDirection: 'row', alignItems: 'center', padding: 14, borderBottomWidth: 1, borderBottomColor: '#eee' },
  simulationOption: { backgroundColor: '#f0f0f0', borderRadius: 8, marginBottom: 10 },
  paymentText: { marginLeft: 12, fontSize: 16, color: '#333' },
  closeButton: { backgroundColor: '#a0855c', borderRadius: 8, padding: 12, alignItems: 'center', marginTop: 15 },
  closeText: { color: '#fff', fontWeight: 'bold' },
  confirmBox: { marginTop: 20, backgroundColor: '#e7f6e7', padding: 16, borderRadius: 10, borderWidth: 1, borderColor: '#4CAF50', alignItems: 'center' },
  confirmText: { color: '#2E7D32', fontWeight: 'bold', fontSize: 16 },
});
