import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const storedUserData = await AsyncStorage.getItem('userData');
                if (!storedUserData) return;

                const userData = JSON.parse(storedUserData);
                const professionalId = userData.professionalId;
                console.log('professionalId:', professionalId);

                setLoading(true);
                setError(null);

                const url = `https://medplus-health.onrender.com/api/appointments/doctor/${professionalId}/all`;
                const response = await fetch(url);
                const allData = await response.json();
                const appointmentsArray = Array.isArray(allData) ? allData : [];

                setAppointments(appointmentsArray);
            } catch (err) {
                console.error('Error fetching appointments:', err.message);
                setError('Error fetching appointments');
            } finally {
                setLoading(false);
            }
        };

        fetchAppointments();
    }, []);

    const confirmAppointment = async (appointmentId) => {
        try {
            const response = await fetch(
                `https://medplus-health.onrender.com/api/appointments/confirm/${appointmentId}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.ok) {
                setAppointments((prev) =>
                    prev.map((appointment) =>
                        appointment._id === appointmentId ? { ...appointment, status: 'confirmed' } : appointment
                    )
                );
            } else {
                throw new Error('Failed to confirm appointment');
            }
        } catch (err) {
            console.error(err);
            setError('Error confirming appointment');
        }
    };

    const cancelAppointment = async (appointmentId) => {
        try {
            const response = await fetch(
                `https://medplus-health.onrender.com/api/appointments/cancel/${appointmentId}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.ok) {
                setAppointments((prev) =>
                    prev.filter((appointment) => appointment._id !== appointmentId)
                );
            } else {
                throw new Error('Failed to cancel appointment');
            }
        } catch (err) {
            console.error(err);
            setError('Error cancelling appointment');
        }
    };

    const transformAppointmentsToAgendaFormat = (appointments) => {
        const formattedAppointments = {};
        for (const [date, events] of Object.entries(appointments)) {
            formattedAppointments[date] = events.map(event => ({
                id: event.id,
                name: event.name,
                height: event.height,
                timeSlot: event.timeSlot
            }));
        }
        return formattedAppointments;
    };

    return {
        appointments,
        loading,
        error,
        confirmAppointment,
        cancelAppointment,
        transformAppointmentsToAgendaFormat, // Expose the new function
    };
};

export default useAppointments;
