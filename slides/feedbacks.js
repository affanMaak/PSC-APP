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
    FlatList,
    RefreshControl,
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import Icon from 'react-native-vector-icons/Ionicons';
import IconAD from 'react-native-vector-icons/AntDesign';
import { feedbackAPI } from '../config/apis';

const THEME_COLOR = '#b48a64'; // Gold
const SECONDARY_COLOR = '#1A1A1A'; // Deep Black
const BG_COLOR = '#F8F9FA';

const FeedbackScreen = ({ navigation }) => {
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [filteredSubCategories, setFilteredSubCategories] = useState([]);
    const [feedbacks, setFeedbacks] = useState([]);
    const [isAdding, setIsAdding] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

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
        fetchFeedbacks();
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

    const fetchFeedbacks = async () => {
        try {
            const data = await feedbackAPI.getFeedbacks();
            console.log('Feedback data structure:', JSON.stringify(data, null, 2));
            setFeedbacks(data);
        } catch (error) {
            console.error('Fetch feedbacks error:', error);
            Alert.alert('Error', 'Failed to load feedback history. Please try again.');
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchFeedbacks();
        setRefreshing(false);
    };

    const getStatusBadge = (status) => {
        let bgColor, textColor;
        switch (status?.toUpperCase()) {
            case 'PENDING':
                bgColor = '#FFFBEB'; // Yellow background
                textColor = '#92400E'; // Yellow text
                break;
            case 'IN_PROCESS':
            case 'IN PROGRESS':
                bgColor = '#E0F2FE'; // Blue background
                textColor = '#0369A1'; // Blue text
                break;
            case 'COMPLETED':
                bgColor = '#ECFDF5'; // Green background
                textColor = '#14532D'; // Green text
                break;
            default:
                bgColor = '#F3F4F6'; // Gray background
                textColor = '#374151'; // Gray text
        }

        return (
            <View style={[styles.badge, { backgroundColor: bgColor }]}>
                <Text style={[styles.badgeText, { color: textColor }]}>
                    {status || 'Unknown'}
                </Text>
            </View>
        );
    };

    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch (error) {
            return 'Invalid Date';
        }
    };

    const renderFeedbackHistory = () => {
        return (
            <View style={styles.historyContainer}>
                <View style={styles.historyHeader}>
                    <View>
                        <Text style={styles.historyTitle}>Feedback History</Text>
                        <Text style={styles.historySubtitle}>View your submitted feedback and admin responses</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.fabButton}
                        onPress={() => setIsAdding(true)}
                    >
                        <Icon name="add" size={24} color="#FFF" />
                    </TouchableOpacity>
                </View>

                {feedbacks.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <View style={styles.emptyIconContainer}>
                            <Icon name="chatbubble-ellipses-outline" size={60} color="#B0B0B0" />
                        </View>
                        <Text style={styles.emptyText}>No feedback history yet</Text>
                        <Text style={styles.emptySubtext}>Your submitted feedback will appear here</Text>
                        <TouchableOpacity
                            style={styles.emptyActionButton}
                            onPress={() => setIsAdding(true)}
                        >
                            <Text style={styles.emptyActionText}>Submit Your First Feedback</Text>
                            <Icon name="arrow-forward" size={16} color="#FFF" style={{ marginLeft: 8 }} />
                        </TouchableOpacity>
                    </View>
                ) : (
                    <FlatList
                        data={feedbacks}
                        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
                        renderItem={({ item }) => (
                            <View style={styles.feedbackCard}>
                                <View style={styles.cardHeader}>
                                    <View style={styles.cardHeaderLeft}>
                                        <Text style={styles.feedbackDate}>{formatDate(item.createdAt || item.created_at)}</Text>
                                        <Text style={styles.feedbackTime}>
                                            {new Date(item.createdAt || item.created_at).toLocaleTimeString('en-US', {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </Text>
                                    </View>
                                    {getStatusBadge(item.status)}
                                </View>

                                <Text style={styles.feedbackSubject}>{typeof item.subject === 'string' ? item.subject : 'No subject'}</Text>

                                <Text style={styles.feedbackMessage} numberOfLines={3}>
                                    {typeof item.message === 'string' ? item.message : 'No message'}
                                </Text>

                                <View style={styles.categoryContainer}>
                                    <Icon name="pricetags-outline" size={14} color="#666" />
                                    <Text style={styles.feedbackCategory}>
                                        {typeof item.category === 'string' ? item.category :
                                            typeof item.category?.name === 'string' ? item.category.name :
                                                'N/A'}
                                    </Text>
                                    {(typeof item.subCategory === 'string' || typeof item.subCategory?.name === 'string') && (
                                        <Text style={styles.feedbackSubCategory}>
                                            • {typeof item.subCategory === 'string' ? item.subCategory : item.subCategory.name}
                                        </Text>
                                    )}
                                </View>

                                {/* Admin Remarks Section */}
                                {((item.remarks && (typeof item.remarks === 'string' || Array.isArray(item.remarks))) ||
                                    (item.adminRemarks && typeof item.adminRemarks === 'string') ||
                                    (item.remark && typeof item.remark === 'string')) && (
                                        <View style={styles.remarksContainer}>
                                            <View style={styles.remarksHeader}>
                                                <Icon name="information-circle" size={16} color="#4A90E2" />
                                                <Text style={styles.remarksTitle}>Admin Response</Text>
                                            </View>
                                            <Text style={styles.remarksText}>
                                                {typeof item.remarks === 'string' ? item.remarks :
                                                    typeof item.adminRemarks === 'string' ? item.adminRemarks :
                                                        typeof item.remark === 'string' ? item.remark :
                                                            Array.isArray(item.remarks) ?
                                                                item.remarks.map(r =>
                                                                    typeof r === 'string' ? r :
                                                                        r.remark || r.text || r.message || JSON.stringify(r)
                                                                ).filter(Boolean).join('\n\n') :
                                                                ''}
                                            </Text>
                                            {item.adminName && typeof item.adminName === 'string' && (
                                                <Text style={styles.adminName}>— {item.adminName}</Text>
                                            )}
                                        </View>
                                    )}
                            </View>
                        )}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                                colors={[THEME_COLOR]}
                                tintColor={THEME_COLOR}
                            />
                        }
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 30 }}
                    />
                )}
            </View>
        );
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

            // ✅ Payload without otherSubCategory
            const payload = {
                subject: form.subject,
                message: form.message,
                categoryId: form.categoryId,
                subCategoryId: form.subCategoryId === 'OTHER' ? null : form.subCategoryId,
                // ❌ otherSubCategory is NOT sent
            };

            await feedbackAPI.submitFeedback(payload);

            // Refresh the feedback list after successful submission
            await fetchFeedbacks();

            // Reset the form
            setForm({
                subject: '',
                categoryId: null,
                subCategoryId: null,
                otherSubCategory: '',
                message: '',
            });

            Alert.alert(
                'Success',
                'Thank you for your feedback! We will review it shortly.',
                [{ text: 'OK', onPress: () => setIsAdding(false) }]
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
                <Text style={styles.loadingText}>Loading Feedback...</Text>
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
                        onPress={() => {
                            if (isAdding) {
                                setIsAdding(false);
                            } else {
                                navigation.goBack();
                            }
                        }}
                    >
                        <IconAD name="arrowleft" size={26} color="black" />
                    </TouchableOpacity>
                    <View style={styles.titleContainer}>
                        <Text style={styles.headerTitle}>{isAdding ? 'New Feedback' : 'Feedback'}</Text>
                        <Text style={styles.headerSubtitle}>{isAdding ? 'Submit your feedback' : 'View history & submit feedback'}</Text>
                    </View>
                    <View style={{ width: 40 }} />
                </View>
            </ImageBackground>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                {isAdding ? (
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
                ) : (
                    renderFeedbackHistory()
                )}
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FEF9F3',
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
        borderRadius: 25,
        padding: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08,
        shadowRadius: 15,
        elevation: 5,
        borderWidth: 1,
        borderColor: '#F5F5F5',
    },
    inputGroup: {
        marginBottom: 25,
    },
    label: {
        fontSize: 16,
        fontWeight: '700',
        color: SECONDARY_COLOR,
        marginBottom: 12,
        marginLeft: 2,
    },
    input: {
        backgroundColor: '#FFF',
        borderWidth: 2,
        borderColor: '#E2E8F0',
        borderRadius: 15,
        padding: 18,
        fontSize: 16,
        color: '#2D3748',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.03,
        shadowRadius: 3,
        elevation: 1,
    },
    textArea: {
        height: 140,
        textAlignVertical: 'top',
        paddingTop: 18,
    },
    dropdown: {
        height: 60,
        backgroundColor: '#FFF',
        borderRadius: 15,
        paddingHorizontal: 18,
        borderWidth: 2,
        borderColor: '#E2E8F0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.03,
        shadowRadius: 3,
        elevation: 1,
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
        height: 60,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 15,
        shadowColor: THEME_COLOR,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 6,
        borderWidth: 0,
    },
    disabledButton: {
        opacity: 0.7,
        shadowOpacity: 0.1,
    },
    submitButtonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '800',
        letterSpacing: 0.5,
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
    historyContainer: {
        flex: 1,
        backgroundColor: '#FAF8F5',
        padding: 20,
    },
    historyHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 25,
    },
    historyTitle: {
        fontSize: 26,
        fontWeight: '800',
        color: SECONDARY_COLOR,
        letterSpacing: 0.5,
    },
    historySubtitle: {
        fontSize: 14,
        color: '#777',
        fontWeight: '500',
        marginTop: 4,
    },
    fabButton: {
        backgroundColor: THEME_COLOR,
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: THEME_COLOR,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 60,
        paddingHorizontal: 30,
    },
    emptyIconContainer: {
        marginBottom: 25,
        opacity: 0.7,
    },
    emptyText: {
        fontSize: 22,
        fontWeight: '700',
        color: '#555',
        marginBottom: 12,
        textAlign: 'center',
    },
    emptySubtext: {
        fontSize: 16,
        color: '#888',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 30,
        paddingHorizontal: 20,
    },
    emptyActionButton: {
        backgroundColor: THEME_COLOR,
        flexDirection: 'row',
        paddingHorizontal: 25,
        paddingVertical: 15,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: THEME_COLOR,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 5,
    },
    emptyActionText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    feedbackCard: {
        backgroundColor: '#FFF',
        borderRadius: 18,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    cardHeaderLeft: {
        flex: 1,
    },
    feedbackDate: {
        fontSize: 15,
        color: SECONDARY_COLOR,
        fontWeight: '700',
        marginBottom: 2,
    },
    feedbackTime: {
        fontSize: 13,
        color: '#888',
        fontWeight: '500',
    },
    badge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        minWidth: 90,
        alignItems: 'center',
        alignSelf: 'flex-start',
    },
    badgeText: {
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    feedbackSubject: {
        fontSize: 19,
        fontWeight: '700',
        color: SECONDARY_COLOR,
        marginBottom: 12,
        lineHeight: 26,
    },
    feedbackMessage: {
        fontSize: 15,
        color: '#555',
        lineHeight: 22,
        marginBottom: 16,
    },
    categoryContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        flexWrap: 'wrap',
    },
    feedbackCategory: {
        fontSize: 14,
        color: '#666',
        fontWeight: '600',
        marginLeft: 6,
        marginRight: 8,
    },
    feedbackSubCategory: {
        fontSize: 14,
        color: '#888',
        fontWeight: '500',
    },
    remarksContainer: {
        backgroundColor: '#F8FAFC',
        borderRadius: 12,
        padding: 16,
        borderLeftWidth: 4,
        borderLeftColor: '#4A90E2',
        marginTop: 12,
    },
    remarksHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    remarksTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#2D3748',
        marginLeft: 8,
    },
    remarksText: {
        fontSize: 15,
        color: '#4A5568',
        lineHeight: 22,
        fontStyle: 'italic',
    },
    adminName: {
        fontSize: 13,
        color: '#718096',
        fontWeight: '600',
        marginTop: 8,
        textAlign: 'right',
    },
});

export default FeedbackScreen;
