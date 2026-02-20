import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
    View,
    FlatList,
    Image,
    StyleSheet,
    ActivityIndicator,
    Dimensions
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const LawnSlider = ({
    images = [],
    height = 200,
    autoPlay = true,
    interval = 3000,
    borderRadius = 0
}) => {
    const [measuredWidth, setMeasuredWidth] = useState(0);
    const [activeIndex, setActiveIndex] = useState(0);
    const [imageErrors, setImageErrors] = useState({});

    const flatListRef = useRef(null);
    const timerRef = useRef(null);
    const currentOffsetRef = useRef(0);
    const isUserInteracting = useRef(false);

    const stopAutoPlay = useCallback(() => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    }, []);

    const startAutoPlay = useCallback(() => {
        if (!autoPlay || images.length <= 1 || measuredWidth === 0 || isUserInteracting.current) return;

        stopAutoPlay();
        timerRef.current = setInterval(() => {
            if (flatListRef.current && !isUserInteracting.current) {
                const nextOffset = (currentOffsetRef.current + measuredWidth) >= (images.length * measuredWidth)
                    ? 0
                    : (currentOffsetRef.current + measuredWidth);

                flatListRef.current.scrollToOffset({
                    offset: nextOffset,
                    animated: true,
                });
                currentOffsetRef.current = nextOffset;
                setActiveIndex(Math.round(nextOffset / measuredWidth));
            }
        }, interval);
    }, [autoPlay, images, measuredWidth, interval, stopAutoPlay]);

    useEffect(() => {
        // Reset scroll when images change to ensure sequence starts from index 0
        if (flatListRef.current) {
            flatListRef.current.scrollToOffset({ offset: 0, animated: false });
            currentOffsetRef.current = 0;
            setActiveIndex(0);
        }

        startAutoPlay();
        return stopAutoPlay;
    }, [images, startAutoPlay, stopAutoPlay]);

    const onLayout = (event) => {
        const { width } = event.nativeEvent.layout;
        if (width > 0 && Math.abs(width - measuredWidth) > 1) {
            setMeasuredWidth(width);
        }
    };

    const handleImageError = (index) => {
        setImageErrors(prev => ({ ...prev, [index]: true }));
    };

    const renderItem = ({ item, index }) => {
        let uri = null;
        if (typeof item === 'string') {
            uri = item;
        } else if (item && typeof item === 'object') {
            uri = item.url || item.image_url || item.image;
        }

        const imageSource = (imageErrors[index] || !uri)
            ? require('../../assets/bg.jpeg')
            : { uri };

        return (
            <View style={[styles.slide, { height, width: measuredWidth }]}>
                <Image
                    source={imageSource}
                    style={styles.sliderImage}
                    resizeMode="cover"
                    onError={() => handleImageError(index)}
                />
            </View>
        );
    };

    const handleMomentumScrollEnd = (event) => {
        const offset = event.nativeEvent.contentOffset.x;
        currentOffsetRef.current = offset;
        setActiveIndex(Math.round(offset / measuredWidth));
        isUserInteracting.current = false;
        startAutoPlay();
    };

    const handleScrollBeginDrag = () => {
        isUserInteracting.current = true;
        stopAutoPlay();
    };

    if (images.length === 0) {
        return (
            <View
                style={[styles.container, { height, borderTopLeftRadius: borderRadius, borderTopRightRadius: borderRadius }]}
                onLayout={onLayout}
            >
                <Image
                    source={require('../../assets/bg.jpeg')}
                    style={styles.sliderImage}
                    resizeMode="cover"
                />
            </View>
        );
    }

    if (measuredWidth === 0) {
        return (
            <View
                style={[styles.container, { height, borderTopLeftRadius: borderRadius, borderTopRightRadius: borderRadius }]}
                onLayout={onLayout}
            >
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color="#b48a64" />
                </View>
            </View>
        );
    }

    return (
        <View style={[styles.container, { height, borderTopLeftRadius: borderRadius, borderTopRightRadius: borderRadius }]}>
            <FlatList
                ref={flatListRef}
                data={images}
                renderItem={renderItem}
                horizontal
                pagingEnabled={false}
                snapToInterval={measuredWidth}
                snapToAlignment="center"
                decelerationRate="fast"
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={handleMomentumScrollEnd}
                onScrollBeginDrag={handleScrollBeginDrag}
                onScrollEndDrag={() => { }}
                keyExtractor={(item, index) => index.toString()}
                getItemLayout={(data, index) => ({
                    length: measuredWidth,
                    offset: measuredWidth * index,
                    index,
                })}
                initialNumToRender={5}
                windowSize={5}
                scrollEventThrottle={16}
                removeClippedSubviews={true}
                scrollEnabled={images.length > 1}
            />
            {images.length > 1 && (
                <View style={styles.pagination}>
                    {images.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.dot,
                                activeIndex === index ? styles.activeDot : styles.inactiveDot,
                            ]}
                        />
                    ))}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        backgroundColor: '#f0f0f0',
        overflow: 'hidden',
        width: '100%',
    },
    slide: {
        backgroundColor: '#f0f0f0',
    },
    sliderImage: {
        width: '100%',
        height: '100%',
    },
    pagination: {
        position: 'absolute',
        bottom: 12,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dot: {
        height: 6,
        borderRadius: 3,
        marginHorizontal: 3,
    },
    activeDot: {
        backgroundColor: '#fff',
        width: 15, // Elongated active dot as in start.js
    },
    inactiveDot: {
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        width: 6,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default LawnSlider;
