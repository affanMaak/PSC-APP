import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    Alert,
    ActivityIndicator,
    ImageBackground,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import Icon from 'react-native-vector-icons/Ionicons';
import IconAD from 'react-native-vector-icons/AntDesign';
import { feedbackAPI } from '../config/apis';

const THEME_COLOR = 'rgba(216, 184, 54, 0.9)'; // Gold
const SECONDARY_COLOR = '#1A1A1A'; // Deep Black
const BG_COLOR = '#F8F9FA';

const FeedbackScreen = ({ navigation }) => {
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [filteredSubCategories, setFilteredSubCategories] = useState([]);

    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [form, setForm] = useState({
        subject: '',
        categoryId: null,
        subCategoryId: null,
        otherSubCategory: '',
        message: '',
    });

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            setLoading(true);
            const [cats, subCats] = await Promise.all([
                feedbackAPI.getCategories(),
                feedbackAPI.getSubCategories(),
            ]);

            setCategories(cats.map(c => ({ label: c.name, value: c.id })));
            setSubCategories(subCats.map(s => ({
                label: s.name,
                value: s.id,
                categoryId: s.categoryId // Assumption: subcategories might be linked
            })));
        } catch (error) {
            console.error('Fetch feedback data error:', error);
            Alert.alert('Error', 'Failed to load categories. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryChange = (item) => {
        setForm(prev => ({
            ...prev,
            categoryId: item.value,
            subCategoryId: null,
            otherSubCategory: ''
        }));

        // Filter subcategories if categoryId exists in subcategory data
        const filtered = subCategories.filter(s => !s.categoryId || s.categoryId === item.value);
        // Add "Other" option
        setFilteredSubCategories([...filtered, { label: 'Other', value: 'OTHER' }]);
    };

    const handleSubmit = async () => {
        if (!form.subject || !form.categoryId || !form.message) {
            Alert.alert('Error', 'Please fill in all required fields (Subject, Category, and Message)');
            return;
        }

        if (form.subCategoryId === 'OTHER' && !form.otherSubCategory) {
            Alert.alert('Error', 'Please specify the other sub-category');
            return;
        }

        try {
            setSubmitting(true);

            const payload = {
                subject: form.subject,
                message: form.message,
                categoryId: form.categoryId,
                subCategoryId: form.subCategoryId === 'OTHER' ? null : form.subCategoryId,
                otherSubCategory: form.subCategoryId === 'OTHER' ? form.otherSubCategory : null,
            };

            await feedbackAPI.submitFeedback(payload);

            Alert.alert(
                'Success',
                'Thank you for your feedback! We will review it shortly.',
                [{ text: 'OK', onPress: () => navigation.goBack() }]
            );
        } catch (error) {
            console.error('Submit feedback error:', error);
            Alert.alert('Error', error.response?.data?.message || 'Failed to submit feedback. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color={THEME_COLOR} />
                <Text style={styles.loadingText}>Preparing Feedback Form...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ImageBackground
                source={require('../assets/notch.jpg')}
                style={styles.headerBg}
                imageStyle={styles.headerImage}
            >
                <View style={styles.headerContent}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <IconAD name="arrowleft" size={26} color="black" />
                    </TouchableOpacity>
                    <View style={styles.titleContainer}>
                        <Text style={styles.headerTitle}>Feedback</Text>
                        <Text style={styles.headerSubtitle}>Help us improve your experience</Text>
                    </View>
                    <View style={{ width: 40 }} />
                </View>
            </ImageBackground>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.formContainer}>

                        {/* Subject */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Subject *</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Briefly describe your feedback"
                                placeholderTextColor="#999"
                                value={form.subject}
                                onChangeText={(text) => setForm(prev => ({ ...prev, subject: text }))}
                            />
                        </View>

                        {/* Category */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Category *</Text>
                            <Dropdown
                                style={styles.dropdown}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                inputSearchStyle={styles.inputSearchStyle}
                                iconStyle={styles.iconStyle}
                                data={categories}
                                search
                                maxHeight={300}
                                labelField="label"
                                valueField="value"
                                placeholder="Select Category"
                                searchPlaceholder="Search..."
                                value={form.categoryId}
                                onChange={handleCategoryChange}
                                renderLeftIcon={() => (
                                    <Icon style={styles.icon} color={THEME_COLOR} name="list" size={20} />
                                )}
                            />
                        </View>

                        {/* Sub Category */}
                        {form.categoryId && (
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Sub-Category</Text>
                                <Dropdown
                                    style={styles.dropdown}
                                    placeholderStyle={styles.placeholderStyle}
                                    selectedTextStyle={styles.selectedTextStyle}
                                    inputSearchStyle={styles.inputSearchStyle}
                                    iconStyle={styles.iconStyle}
                                    data={filteredSubCategories}
                                    search
                                    maxHeight={300}
                                    labelField="label"
                                    valueField="value"
                                    placeholder="Select Sub-Category"
                                    searchPlaceholder="Search..."
                                    value={form.subCategoryId}
                                    onChange={(item) => setForm(prev => ({ ...prev, subCategoryId: item.value }))}
                                    renderLeftIcon={() => (
                                        <Icon style={styles.icon} color={THEME_COLOR} name="options" size={20} />
                                    )}
                                />
                            </View>
                        )}

                        {/* Other Sub Category */}
                        {form.subCategoryId === 'OTHER' && (
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Please specify *</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter custom category"
                                    placeholderTextColor="#999"
                                    value={form.otherSubCategory}
                                    onChangeText={(text) => setForm(prev => ({ ...prev, otherSubCategory: text }))}
                                />
                            </View>
                        )}

                        {/* Message */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Message / Remarks *</Text>
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                placeholder="Share your detailed thoughts, suggestions or complaints..."
                                placeholderTextColor="#999"
                                multiline
                                numberOfLines={6}
                                value={form.message}
                                onChangeText={(text) => setForm(prev => ({ ...prev, message: text }))}
                                textAlignVertical="top"
                            />
                        </View>

                        {/* Submit Button */}
                        <TouchableOpacity
                            style={[styles.submitButton, submitting && styles.disabledButton]}
                            onPress={handleSubmit}
                            disabled={submitting}
                        >
                            {submitting ? (
                                <ActivityIndicator color="#FFF" />
                            ) : (
                                <>
                                    <Text style={styles.submitButtonText}>Submit Feedback</Text>
                                    <Icon name="send" size={18} color="#FFF" style={{ marginLeft: 10 }} />
                                </>
                            )}
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BG_COLOR,
    },
    headerBg: {
        paddingTop: Platform.OS === 'ios' ? 10 : 40,
        paddingBottom: 25,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        overflow: 'hidden',
    },
    headerImage: {
        opacity: 0.9,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    backButton: {
        padding: 8,
        backgroundColor: 'rgba(255,255,255,0.7)',
        borderRadius: 12,
    },
    titleContainer: {
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: SECONDARY_COLOR,
        letterSpacing: 0.5,
    },
    headerSubtitle: {
        fontSize: 12,
        color: '#555',
        fontWeight: '500',
        marginTop: 2,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 50,
    },
    formContainer: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: SECONDARY_COLOR,
        marginBottom: 8,
        marginLeft: 4,
    },
    input: {
        backgroundColor: '#FAFAFA',
        borderWidth: 1.5,
        borderColor: '#F0F0F0',
        borderRadius: 12,
        padding: 15,
        fontSize: 15,
        color: '#333',
    },
    textArea: {
        height: 120,
        textAlignVertical: 'top',
    },
    dropdown: {
        height: 55,
        backgroundColor: '#FAFAFA',
        borderRadius: 12,
        paddingHorizontal: 15,
        borderWidth: 1.5,
        borderColor: '#F0F0F0',
    },
    icon: {
        marginRight: 10,
    },
    placeholderStyle: {
        fontSize: 15,
        color: '#999',
    },
    selectedTextStyle: {
        fontSize: 15,
        color: '#333',
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 15,
        borderRadius: 8,
    },
    submitButton: {
        backgroundColor: THEME_COLOR,
        flexDirection: 'row',
        height: 55,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        shadowColor: THEME_COLOR,
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    disabledButton: {
        opacity: 0.6,
    },
    submitButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: BG_COLOR,
    },
    loadingText: {
        marginTop: 15,
        fontSize: 15,
        color: '#666',
        fontWeight: '500',
    },
});

export default FeedbackScreen;
