import { Platform, StyleSheet } from "react-native";
import { Colors, Fonts } from "../../../theme";

export const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: '#f8e9b0',
  },
  homeContainer: {
    flex: 1,
   backgroundColor: '#ecf2f9',
  },
  homeView: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f8e9b0',
    paddingTop: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  profileView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  details: {
    paddingLeft: 15,
  },
  userProfileImg: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  notiImg: {
    width: 25,
    height: 25,
  },
  tasksText: {
    color: 'white',
    fontFamily: Fonts.MEDIUM,
  },
  mesText: {
    fontSize: 20,
    color: 'white',
    fontFamily: Fonts.BOLD,
  },
  taskSummaryView: {
    backgroundColor: '#9bf4d5',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
    padding: 20,
  },
  taskText: {
    fontSize: 14,
    padding: 10,
    color: 'black',
    fontFamily: Fonts.MEDIUM,
  },
  taskSummaryCard: {
    backgroundColor: '#ffc0d0',
    marginTop: 20,
    marginHorizontal: 20,
    borderRadius: 10,
    paddingBottom: 10,
  },
  addTaskImg: {
    width: 30,
    height: 30,
  },
  addView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  percentageText: {
    color: 'black',
    fontFamily: Fonts.MEDIUM,
  },
  upComings: {
    paddingHorizontal: 20,
    marginTop: 15,
  },
  upcoingText: {
    fontSize: 18,
    color: "black",
    marginHorizontal: 5,
    fontFamily: Fonts.BOLD,
  },
  taskContainer: {
    marginHorizontal: 5,
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 15,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 3,
      },
    }),
  },
  taskName: {
    fontSize: 14,
    marginBottom: 5,
    fontFamily: Fonts.BOLD,
  },
  taskDetails: {
    fontSize: 12,
    fontFamily: Fonts.MEDIUM,
  },
  taskListView: {
    paddingHorizontal: 20,
    marginTop: 15,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    backgroundColor: '#f0f0f0',
  },
  filterText: {
    color: 'black',
    fontFamily: Fonts.MEDIUM,
  },
  activeFilterButton: {
    backgroundColor: Colors.primary,
  },
  activeFilterText: {
    color: '#fff',
    fontFamily: Fonts.MEDIUM,
  },
  statusCircle: {
    flexDirection: 'row',
    justifyContent: "space-between",
  },
  pendingTask: {
    width: 15,
    height: 15,
    backgroundColor: "red",
    borderRadius: 25,
  },
  statusDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
