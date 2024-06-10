import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native";

const sections = [
    {
        title: "Getting Started",
        illustration: require("../../../assets/undraw_my_app_re_gxtj.png"),
    },
    {
        title: "Account Management",
        illustration: require("../../../assets/undraw_sign_up_n6im 1.png"),
    },
    {
        title: "Community Guidelines",
        illustration: require("../../../assets/undraw_pending_approval_xuu9 1.png"),
    },
    {
        title: "Social Features",
        illustration: require("../../../assets/undraw_social_girl_re_kdrx 1.png"),
    },
    {
        title: "Using MovieHub",
        illustration: require("../../../assets/undraw_access_account_re_8spm 1.png"), // Example, update the path accordingly
    },
    {
        title: "FAQs",
        illustration: require("../../../assets/undraw_faq_re_31cw 1.png"),
    }
];

export default function HelpCentre({ navigation }) {
    return (
        <ScrollView style={styles.container}>
            <Text style={styles.heading}>Welcome to the MovieHub Help Centre</Text>
            <Text style={styles.intro}>Here you will find all the information you need to get the most out of MovieHub. Browse the sections below to find the help you need.</Text>
            
            <View style={styles.grid}>
                {sections.map((section, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.card}
                        onPress={() => navigation.navigate(section.title.replace(" ", ""))} // Assumes you have set up navigation for each section
                    >
                        <Image source={section.illustration} style={styles.illustration} />
                        <Text style={styles.cardTitle}>{section.title}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 22,
        backgroundColor: "#fff",
    },
    heading: {
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 5,
    },
    intro: {
        fontSize: 16,
        textAlign: "center",
        marginBottom: 30,
    },
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },
    card: {
        width: "48%",
        aspectRatio: 1,
        marginBottom: 16,
        backgroundColor: "#f0f0f0",
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
    },
    cardTitle: {
        marginTop: 8,
        fontSize: 14,
        fontWeight: "bold",
        textAlign: "center",
    },
    illustration: {
        width: "80%",
        height: "80%",
        resizeMode: "contain",
    },
});

