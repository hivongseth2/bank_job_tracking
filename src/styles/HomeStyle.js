import {

    StyleSheet,

} from "react-native"
const styles = StyleSheet.create({
    header: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        overflow: "hidden",
        paddingTop: 40,
        paddingHorizontal: 20,
        zIndex: 1000,
    },
    headerTitle: {
        position: "absolute",
        bottom: 16,
        left: 20,
        right: 20,
    },
    headerTitleText: {
        color: "white",
        fontSize: 20,
        fontWeight: "bold",
    },
    scrollContent: {
        paddingTop: 350,
        padding: 16,
    },
    headerTop: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    greeting: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
    },
    date: {
        color: "rgba(255, 255, 255, 0.8)",
        fontSize: 14,
        marginTop: 4,
    },
    headerIcons: {
        flexDirection: "row",
    },
    iconButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        justifyContent: "center",
        alignItems: "center",
    },
    balanceContainer: {
        marginBottom: 20,
    },
    balanceLabel: {
        color: "rgba(255, 255, 255, 0.8)",
        fontSize: 14,
        marginBottom: 4,
    },
    balanceAmount: {
        color: "white",
        fontSize: 32,
        fontWeight: "bold",
        marginBottom: 8,
    },
    balanceSummary: {
        flexDirection: "row",
        marginTop: 8,
    },
    balanceItem: {
        flexDirection: "row",
        alignItems: "center",
        marginRight: 16,
    },
    balanceItemText: {
        color: "rgba(255, 255, 255, 0.9)",
        fontSize: 14,
        marginLeft: 4,
    },
    quickActions: {
        flexDirection: "row",
        justifyContent: "space-between",
        borderRadius: 16,
        padding: 16,
        marginTop: 16,
    },
    actionButton: {
        alignItems: "center",
        flex: 1,
    },
    actionIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 8,
    },
    actionText: {
        fontSize: 12,
        fontWeight: "500",
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginTop: 24,
        marginBottom: 16,
    },
    summaryContainer: {
        flex: 1
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 16,
    },
    transactionsCard: {
        padding: 0,
        overflow: "hidden",
    },
    viewAllButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        borderTopWidth: 1,
    },
    viewAllText: {
        fontSize: 14,
        fontWeight: "500",
        marginRight: 4,
    },
    fab: {
        position: "absolute",
        bottom: 24,
        right: 24,
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: "center",
        alignItems: "center",
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
    },
    errorText: {
        fontSize: 16,
        marginBottom: 16,
    },
    setupButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        alignSelf: "flex-start",
    },
    setupButtonText: {
        color: "white",
        fontWeight: "500",
    },
    featuresContainer: {
        marginBottom: 16,
    },
    featureCard: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        borderWidth: 1,
    },
    featureIconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 16,
    },
    featureContent: {
        flex: 1,
    },
    featureTitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 4,
    },
    featureDescription: {
        fontSize: 13,
    },
})

export default styles