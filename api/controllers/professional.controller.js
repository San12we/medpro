exports.updateProfile = async (req, res) => {
    const { professionalId } = req.params; // This is the professional ID in the document
    const {
        consultationFee,
        medicalDegrees,
        specialization,
        certifications,
        licenseNumber,
        issuingMedicalBoard,
        yearsOfExperience,
        specializedTreatment,
        customSpecializedTreatment,
    } = req.body; // Extract the updated details from the request body

    try {
        // Check if the professional exists by matching the _id field with the provided professionalId
        const professional = await Professional.findById(professionalId);
        if (!professional) {
            return res.status(404).json({ message: 'Professional not found' });
        }

        // Handle professional details update with safer JSON parsing
        if (medicalDegrees) {
            try {
                professional.professionalDetails.medicalDegrees = Array.isArray(medicalDegrees)
                    ? medicalDegrees
                    : JSON.parse(medicalDegrees);
            } catch (error) {
                professional.professionalDetails.medicalDegrees = [medicalDegrees]; // Assume plain string and wrap in an array
            }
        }

        if (specialization) {
            professional.professionalDetails.specialization = specialization;
        }

        if (certifications) {
            try {
                professional.professionalDetails.certifications = Array.isArray(certifications)
                    ? certifications
                    : JSON.parse(certifications);
            } catch (error) {
                professional.professionalDetails.certifications = [certifications]; // Assume plain string and wrap in an array
            }
        }

        if (licenseNumber) {
            professional.professionalDetails.licenseNumber = licenseNumber;
        }
        if (issuingMedicalBoard) {
            professional.professionalDetails.issuingMedicalBoard = issuingMedicalBoard;
        }
        if (yearsOfExperience) {
            professional.professionalDetails.yearsOfExperience = parseInt(yearsOfExperience, 10); // Convert to integer
        }

        // Update specialized treatment fields
        if (specializedTreatment) {
            professional.professionalDetails.specializedTreatment = specializedTreatment;
        }
        if (customSpecializedTreatment) {
            professional.professionalDetails.customSpecializedTreatment = customSpecializedTreatment;
        }

        // Update consultation fee if provided
        if (consultationFee !== undefined) {
            professional.consultationFee = consultationFee;
        }

        // Save the updated professional data
        await professional.save();

        return res.status(200).json({
            message: 'Profile updated successfully',
            professional,
        });
    } catch (error) {
        console.error('Error updating profile:', error);
        return res.status(500).json({ message: 'Error updating profile' });
    }
};