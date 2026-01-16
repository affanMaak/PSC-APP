import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  StatusBar,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import { getMessingCategory } from '../config/apis';
import HtmlRenderer from '../src/events/HtmlRenderer';

const { width } = Dimensions.get('window');

const DRESS_CODE_HTML = `
  <section class="section">
    <h2>Dress Code – Ball Room</h2>
    <h3>Dress Code</h3>
    <ul>
      <li>Dress pants and shirts with formal shoes</li>
      <li>Safari suits, lounge suits</li>
      <li>Shalwar kameez with coat, blazer, or waistcoat</li>
      <li>Closed shoes</li>
    </ul>
    <h3>Following are not allowed</h3>
    <ul>
      <li>Track suits, jeans, T-shirts, shorts</li>
      <li>Chappals, joggers</li>
      <li>Pointed higher heels</li>
    </ul>
  </section>

  <section class="section">
    <h2>Dress Code – Chinar Lawn / BBQ Lawn</h2>
    <h3>Dress Code</h3>
    <ul>
      <li>Smart casual dress or cotton pant with bush shirt, T-shirt, or polo T-shirt</li>
      <li>Kurta / Shalwar kameez with or without waistcoat</li>
      <li>Jackets, sweaters, all types of coats & waistcoats (winters)</li>
      <li>Jeans and T-shirt</li>
      <li>Track suits</li>
      <li>Closed shoes, moccasins, joggers, back-strap sandals</li>
    </ul>
    <h3>Following are not allowed</h3>
    <ul>
      <li>Sandals without back strap, chappals, slippers</li>
      <li>Sleeveless T-shirts</li>
      <li>Shorts / Bermuda</li>
    </ul>
  </section>

  <section class="section">
    <h2>Dress Code – Engle Bright Hall</h2>
    <h3>Dress Code</h3>
    <ul>
      <li>Dress or cotton pant with shirt (smart casual)</li>
      <li>Lounge suit and safari suit</li>
      <li>Shalwar kameez with coat or blazer</li>
      <li>Closed shoes</li>
    </ul>
    <h3>Following are not allowed</h3>
    <ul>
      <li>Slippers, chappals, joggers</li>
      <li>Track suits, shorts, Bermuda</li>
    </ul>
  </section>

  <section class="section">
    <h2>Dress Code – Dining Hall</h2>
    <h3>Dress Code</h3>
    <ul>
      <li>Dress or cotton pant with shirt (smart casual)</li>
      <li>Lounge suit and safari suit</li>
      <li>Shalwar kameez with coat or blazer</li>
      <li>Jeans and polo T-shirt</li>
      <li>Closed shoes</li>
    </ul>
    <h3>Following are not allowed</h3>
    <ul>
      <li>Slippers, chappals, joggers</li>
      <li>Track suits, shorts, Bermuda</li>
    </ul>
  </section>

  <section class="section">
    <h2>The Club Café</h2>
    <h3>Dress Code</h3>
    <ul>
      <li>Dress or cotton pant with shirt or polo shirt (smart casual)</li>
      <li>Shalwar kameez with or without waistcoat / kurta</li>
      <li>Jackets, sweaters, all types of coats & waistcoats (winters)</li>
      <li>Jeans and T-shirts</li>
      <li>Track suits with joggers (outdoor café seating only)</li>
    </ul>
    <h3>Following are not allowed</h3>
    <ul>
      <li>Slippers, chappals</li>
      <li>Shorts, Bermuda</li>
    </ul>
  </section>

  <section class="section">
    <h2>Instructions</h2>
    <ul>
      <li>Members and guests not dressed appropriately will not be served</li>
      <li>Loud mobile phone conversations are not permitted in dining areas</li>
      <li>Members and guests are expected to wear smart attire</li>
      <li>Smoking is strictly prohibited in all indoor dining areas</li>
      <li>Use of laptops, video calls, or meetings is not allowed in indoor dining areas</li>
      <li>Members and guests are requested to cooperate with club staff</li>
    </ul>
  </section>
`;

const dressCodeTagsStyles = {
  h2: { marginTop: 10, borderBottomWidth: 1, borderBottomColor: '#ddd', paddingBottom: 6, fontSize: 18, fontWeight: 'bold' },
  h3: { marginTop: 15, fontSize: 15, fontWeight: 'bold' },
  ul: { marginLeft: 15, marginBottom: 10 },
  li: { lineHeight: 20, fontSize: 14, color: '#444' }
};

const dressCodeClassesStyles = {
  'not-allowed': { color: '#b00020' },
  'section': { marginBottom: 20 }
};

const cardData = [
  {
    id: '1',
    title: 'The Club Cafe',
    image: require('../assets/Club_Cafe.jpg'),
    screen: 'The_Club_Cafe',
  },
  {
    id: '2',
    title: 'F & B',
    image: require('../assets/F_and_B.jpg'),
    screen: 'FB',
  },

];

const MessingScreen = ({ navigation }) => {
  const [categories, setCategories] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetchMessingData();
  }, []);

  const fetchMessingData = async () => {
    try {
      setLoading(true);
      const categoryData = await getMessingCategory();
      setCategories(categoryData);
    } catch (error) {
      console.error("Error fetching messing data:", error);
    } finally {
      setLoading(false);
    }
  };

  const parseImages = (imageString) => {
    try {
      const parsed = JSON.parse(imageString);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : [];
    } catch (e) {
      return [];
    }
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#5a472c" />
      <View style={styles.container}>

        {/* 🔹 Notch Header */}
        <ImageBackground
          source={require('../assets/notch.jpg')}
          style={styles.notch}
          imageStyle={styles.notchImage}
        >
          <View style={styles.notchContent}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.navigate('start')}
            >
              <Icon name="arrowleft" size={28} color="black" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Messing</Text>
            <View style={{ width: 40 }} /> {/* Empty space instead of bell */}
          </View>
        </ImageBackground>

        {/* 🔹 Main Scrollable Content */}
        <SafeAreaView style={styles.safeArea}>
          <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
            {loading ? (
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 }}>
                <ActivityIndicator size="large" color="#5a472c" />
              </View>
            ) : (
              <View style={{ marginTop: 15 }}>
                {categories.map((item) => {
                  // Handle images: could be array of strings, array of objects, or JSON string
                  let images = [];
                  if (typeof item.images === 'string') {
                    images = parseImages(item.images);
                  } else if (Array.isArray(item.images)) {
                    images = item.images;
                  }

                  // Determine the first image URL
                  let imageUrl = null;
                  if (images.length > 0) {
                    const first = images[0];
                    imageUrl = typeof first === 'string' ? first : first.url;
                  }

                  const imageSource = imageUrl && { uri: imageUrl };

                  return (
                    <TouchableOpacity
                      key={item.id}
                      style={styles.cardWrapper}
                      onPress={() => navigation.navigate('MessingCategoryDetails', {
                        categoryId: item.id,
                        categoryName: item.category,
                        categoryImage: item.images // Pass as is, let details handle it
                      })}
                    >
                      <ImageBackground
                        source={imageSource}
                        style={styles.cardImage}
                        imageStyle={styles.cardImageStyle}
                      >
                        <View style={styles.cardOverlay}>
                          <Text style={styles.cardTitle}>{item.category}</Text>
                          <Icon name="arrowright" size={28} color="#fff" />
                        </View>
                      </ImageBackground>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}

            {/* Dress Code Header */}
            <View style={[styles.dressCodeHeader, { marginTop: 0 }]}>
              <Text style={styles.dressCodeTitle}>DRESS CODE</Text>
            </View>

            <HtmlRenderer
              htmlContent={DRESS_CODE_HTML}
              customTagsStyles={dressCodeTagsStyles}
              customClassesStyles={dressCodeClassesStyles}
            />
          </ScrollView>
        </SafeAreaView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9EFE6' },

  notch: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomEndRadius: 30,
    borderBottomStartRadius: 30,
    overflow: 'hidden',
    minHeight: 120,
  },
  notchImage: {
    resizeMode: 'cover',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  notchContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: { justifyContent: 'center', alignItems: 'center' },
  headerTitle: {
    fontSize: 22, fontWeight: 'bold', color: '#000', flex: 1, textAlign: 'center',
    marginLeft: 20
  },

  cardsContainer: { paddingHorizontal: 15, marginTop: 15 },
  cardWrapper: {
    height: 110,
    marginBottom: 15,
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardImage: { width: '100%', height: '100%', justifyContent: 'center' },
  cardImageStyle: { borderRadius: 15, resizeMode: 'cover' },
  cardOverlay: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: 20,
  },
  cardTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff' },

  safeArea: { flex: 1 },
  scrollView: { flex: 1, backgroundColor: '#F9EFE6' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 30, paddingTop: 0 },

  dressCodeHeader: {
    backgroundColor: '#F8F8F8',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginTop: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  dressCodeTitle: { fontSize: 13, fontWeight: '700', color: '#000', textAlign: 'center', letterSpacing: 0.5 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: '#000', marginBottom: 12 },
  sectionSubtitle: { fontSize: 13, fontWeight: '400', color: '#333' },
  bulletItem: { flexDirection: 'row', marginBottom: 8, paddingRight: 5 },
  bullet: { fontSize: 14, color: '#000', marginRight: 8, marginTop: 1, fontWeight: '600' },
  itemText: { flex: 1, fontSize: 13, color: '#000', lineHeight: 19 },
  sublistItemHeader: { fontSize: 13, fontWeight: 'bold', color: '#000', marginLeft: 16, marginBottom: 8, marginTop: 4 },

});

export default MessingScreen;