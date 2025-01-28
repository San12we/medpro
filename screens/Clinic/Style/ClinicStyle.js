import { StyleSheet } from 'react-native';
import { fontSize, iconSize, spacing as globalSpacing } from '../../../constants/dimensions';
import { Colors } from '../../../constants/Colors';

const _color = "#ececec";
const _borderRadius = 16;
const spacing = globalSpacing.md;

const styles = StyleSheet.create({
  
  container: {
    flex: 1,
    padding: spacing,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  backArrow: {
    width: 20,
    height: 20,
    tintColor: Colors.light.textPrimary 
  },
  textAdd: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: spacing,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  placeholderImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#888',
  },
  editButton: {
    marginTop: spacing / 2,
    padding: spacing / 2,
    backgroundColor: Colors.light.orange,
    borderRadius: 8,
  },
  editButtonText: {
    color: '#fff',
  },
  sectionHeader: {
    fontSize: fontSize.lg,
    fontWeight: 'bold',
    marginBottom: spacing / 2,
    color: Colors.light.textPrimary,
  },
  dayCardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing,
  },
  dayCard: {
    padding: spacing / 2,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginRight: spacing / 2,
    marginBottom: spacing / 2,
  },
  activeDayCard: {
    backgroundColor: Colors.light.orange,
    borderColor: Colors.light.orange,
  },
  dayCardText: {
    color: Colors.light.textPrimary,
  },
  hoursContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing,
  },
  addButton: {
    alignItems: 'center',
    marginBottom: spacing,
  },
  addButtonText: {
    fontSize: fontSize.md,
    color: Colors.light.orange,
    fontWeight: '600',
  },
  experienceInputContainer: {
    marginBottom: spacing,
  },
  experienceList: {
    marginBottom: spacing,
  },
  experienceItem: {
    backgroundColor: '#fff',
    padding: spacing,
  },
  experienceInstitution: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  experienceDetails: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  experienceAchievement: {
    fontSize: 14,
    color: '#777',
  },
  submitButton: {
    backgroundColor: '#a0eecc',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  insuranceProvidersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  insuranceProviderCard: {
    padding: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginRight: 8,
    width: 100,
    alignItems: 'center',
  },
  activeInsuranceProviderCard: {
    backgroundColor: '#007BFF',
    borderColor: '#007BFF',
  },
  insuranceProviderCardText: {
    color: '#333',
  },
  insuranceProviderIcon: {
    width: 40,
    height: 40,
    marginBottom: 4,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing,
  },
  switchLabel: {
    fontSize: fontSize.md,
    color: Colors.light.textPrimary,
  },
  selectedServicesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing,
  },
  serviceCard: {
    padding: spacing / 2,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginRight: spacing / 2,
    marginBottom: spacing / 2,
  },
  activeServiceCard: {
    backgroundColor: Colors.light.orange,
    borderColor: Colors.light.orange,
  },
  serviceCardText: {
    color: Colors.light.textPrimary,
  },
  servicesContainer: {
    marginBottom: spacing,
  },
  dayContainer: {
    borderWidth: 1,
    borderColor: _color,
    padding: spacing,
    borderRadius: _borderRadius,
    gap: spacing,
  },

  recurrenceOption: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: 'black',
  },
    recurrenceDropdown: {
    position: 'absolute',
    top: 32,
    right: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  daySwitch: {
    transform: [{ scale: 0.7 }],
  },
  dayBlockContainer: {
    gap: spacing,
  },
  dayBlockRow: {
    flexDirection: 'row',
    gap: spacing,
    alignItems: 'center',
  },
  hourBlock: {
    borderWidth: 1,
    borderColor: _color,
    borderRadius: _borderRadius - spacing / 2,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing / 4,
  },
  removeButton: {
    backgroundColor: _color,
    height: 30,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: _borderRadius - spacing / 2,
  },
  addHourButton: {
    flexDirection: 'row',
    gap: spacing / 2,
    padding: spacing,
    borderRadius: _borderRadius - spacing / 2,
    backgroundColor: _color,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing / 2,
  },
  addHourIcon: {
    width: 20,
    height: 20,
    tintColor: 'blue',
  },
  previewContainer: {
    marginTop: spacing * 2,
  },
  previewTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: spacing,
  },
  dayPreview: {
    marginBottom: spacing,
        backgroundColor: '#ecf2f9'
  },
  previewDay: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: spacing / 2,

  },
  slotList: {
    gap: spacing,
    
  },
  slotCard: {
    backgroundColor: '#ffcab0',
    padding: spacing,
    borderRadius: _borderRadius - spacing / 2,
    marginRight: spacing,
  },
  slotText: {
    fontSize: 14,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recurrenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing,
  },
  recurrenceButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  recurrenceButtonText: {
    fontSize: 16,
    color: 'black',
  },
  selectedRecurrence: {
    marginHorizontal: spacing / 2,
    padding: spacing / 2,
    borderRadius: _borderRadius - spacing / 2,
    backgroundColor: 'blue',
    color: 'white',
  },
  toggleButton: {
    backgroundColor: _color,
    height: 30,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: _borderRadius - spacing / 2,
  },
});

export default styles;
