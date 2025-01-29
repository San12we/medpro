import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

import { fontSize, iconSize, spacing } from '../../constants/dimensions'
import { Colors } from '../../constants/Colors'
import { fontFamily } from '../../constants/fontFamily'
import CustomInput from '../../components/CustomInput'
import Feather from "react-native-vector-icons/Feather"
import Ionicons from "react-native-vector-icons/Ionicons"
import FeatherIcon from '@expo/vector-icons/Feather';

import { useTheme } from '@react-navigation/native'
import { ProfileImg } from '@/theme/Images'

import { pickImage, uploadImage } from '../../utils/imageUtils'
import { updateDoctorProfile } from '../../utils/api'
import { useRouter } from 'expo-router'
import { useDispatch, useSelector } from 'react-redux'


const ProfileScreen = () => {
    const { colors } = useTheme()
    const [profileImage, setProfileImage] = useState(null)
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [uploading, setUploading] = useState(false)
    const router = useRouter()
    const dispatch = useDispatch()
    const user = useSelector((state) => state.auth?.user)

    useEffect(() => {
        if (user) {
            setFullName(user.firstName)
            setEmail(user.username)
            setProfileImage(user.profileImage)
            console.log('User ID:', user.userId); // Log the userId
        }
    }, [user])

    const handlePickImage = async () => {
        const imageUri = await pickImage()
        if (imageUri) {
            setProfileImage(imageUri)
        }
    }

    const handleSubmit = async () => {
        if (!fullName || !email || !phoneNumber) {
            Alert.alert('Please fill out all fields.')
            return
        }

        try {
            setUploading(true)
            let profileImageUrl = profileImage

            // Check if the profile image has changed
            if (profileImage && profileImage !== user.profileImage) {
                profileImageUrl = await uploadImage(profileImage)
                if (!profileImageUrl) {
                    throw new Error('Failed to upload image')
                }
            }

            const payload = {
                fullName,
                email,
                phoneNumber,
                profileImage: profileImageUrl,
            }
            console.log('Payload:', payload)

            await updateDoctorProfile(payload, user.userId)
            Alert.alert('Success', 'Profile updated successfully!')
        } catch (error) {
            console.error('Failed to update profile:', error)
            Alert.alert('Failed to update profile')
        } finally {
            setUploading(false)
        }
    }

    const goback = () => {
        router.push('/(tabs)/profile')
    }

    return (
        <KeyboardAvoidingView style={{ flex: 1, backgroundColor: Colors.light.background }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <SafeAreaView style={[styles.container, { paddingTop: 20 }]}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={goback}>
                        <FeatherIcon color="#000" name="arrow-left" size={24} />
                    </TouchableOpacity>
                    <Text style={styles.textAdd}>Personal Information</Text>
                </View>
                <ScrollView style={[styles.container, { backgroundColor: Colors.light.background }]} contentContainerStyle={{ paddingBottom: 2 * spacing.xl }} showsVerticalScrollIndicator={false}>
             
                    <View style={styles.profileImageContainer}>
                        {profileImage ? (
                            <Image source={{ uri: profileImage }} style={styles.profileImage} />
                        ) : (
                            <Image source={ProfileImg} style={styles.profileImage} />
                        )}
                        <TouchableOpacity style={[styles.editIconContainer, { backgroundColor: Colors.light.background }]} onPress={handlePickImage}>
                            <Feather name={"edit-3"} size={iconSize.md} color={Colors.light.orange} />
                        </TouchableOpacity>
                    </View>

                    {/* profile details container */}
                    <View style={styles.nameRoleContainer}>
                        <Text style={[styles.name, { color: Colors.light.textPrimary }]}>{fullName}</Text>
                        <Text style={[styles.role, { color: Colors.light.textSecondary }]}>{email}</Text>
                    </View>

                    {/* input fields container */}
                    <View style={styles.inputFieldsContainer}>
                        <CustomInput
                            label='Full Name' placeholder='Dr. John Doe'
                            icon={<Ionicons name={"person-outline"} size={iconSize.md} color={Colors.light.iconSecondary} style={styles.icon} />}
                            value={fullName} onChangeText={setFullName}
                        />
                        <CustomInput
                            label='Your Email' placeholder='zerodegreecoder@gmail.com'
                            icon={<Ionicons name={"mail-outline"} size={iconSize.md} color={Colors.light.iconSecondary} style={styles.icon} />}
                            value={email} onChangeText={setEmail}
                        />
                        <CustomInput
                            label='Phone Number' placeholder='+93123135'
                            icon={<Feather name={"phone"} size={iconSize.md} color={Colors.light.iconSecondary} style={styles.icon} />}
                            value={phoneNumber} onChangeText={setPhoneNumber}
                        />
                    </View>

                    {/* submit button */}
                    <TouchableOpacity style={[styles.logoutButton, { borderColor: Colors.light.orange }]} onPress={handleSubmit} disabled={uploading}>
                        {uploading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={[styles.logoutText, { color: Colors.light.orange }]}>Submit</Text>
                        )}
                    </TouchableOpacity>
                </ScrollView>
            </SafeAreaView>
        </KeyboardAvoidingView>
    )
}

export default ProfileScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: spacing.md
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingHorizontal: 20
    },
    backArrow: {
        width: 20,
        height: 20,
        tintColor: Colors.light.textPrimary // Ensure the back arrow is visible
    },
    textAdd: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    profileImageContainer: {
        justifyContent: "center",
        alignItems: "center",
        marginTop: spacing.md
    },
    profileImage: {
        height: 140,
        width: 140,
        borderRadius: 70,
        borderWidth: 2,
        borderColor: '#6200ee'
    },
    editIconContainer: {
        height: 35,
        width: 35,
        borderRadius: 15,
        justifyContent: "center",
        alignItems: "center",
        marginTop: -22,
        marginLeft: 45
    },
    nameRoleContainer: {
        alignItems: "center",
        marginVertical: spacing.sm
    },
    name: {
        fontFamily: fontFamily.semiBold,
        fontSize: fontSize.lg,
    },
    role: {
        fontFamily: fontFamily.regular,
        fontSize: fontSize.md,
    },
    inputFieldsContainer: {
        marginVertical: spacing.md
    },
    icon: {
        marginHorizontal: spacing.sm
    },
    logoutButton: {
        borderWidth: 1,
        padding: spacing.md,
        backgroundColor: '#e0ffcd',
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
        marginVertical: spacing.md
    },
    logoutText: {
        fontSize: fontSize.lg,
        fontFamily: fontFamily.bold,
    }
})