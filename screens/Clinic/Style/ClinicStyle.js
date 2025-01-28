import { StyleSheet } from 'react-native';
import { fontSize, iconSize, spacing } from '../../../constants/dimensions';
import { Colors } from '../../../constants/Colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.md,
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
    marginBottom: spacing.md,
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
    marginTop: spacing.sm,
    padding: spacing.sm,
    backgroundColor: Colors.light.orange,
    borderRadius: 8,
  },
  editButtonText: {
    color: '#fff',
  },
  sectionHeader: {
    fontSize: fontSize.lg,
    fontWeight: 'bold',
    marginBottom: spacing.sm,
    color: Colors.light.textPrimary,
  },
  dayCardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.md,
  },
  dayCard: {
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
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
    marginBottom: spacing.md,
  },
  addButton: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  addButtonText: {
    fontSize: fontSize.md,
    color: Colors.light.orange,
    fontWeight: '600',
  },
  experienceInputContainer: {
    marginBottom: spacing.md,
  },
  experienceList: {
    marginBottom: spacing.md,
  },
  experienceItem: {
    backgroundColor: '#fff',
    padding: spacing.md,
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
    backgroundColor: '#28a745',
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
    marginBottom: spacing.md,
  },
  switchLabel: {
    fontSize: fontSize.md,
    color: Colors.light.textPrimary,
  },
  selectedServicesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.md,
  },
  serviceCard: {
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  activeServiceCard: {
    backgroundColor: Colors.light.orange,
    borderColor: Colors.light.orange,
  },
  serviceCardText: {
    color: Colors.light.textPrimary,
  },
  servicesContainer: {
    marginBottom: spacing.md,
  },
});

export default styles;
