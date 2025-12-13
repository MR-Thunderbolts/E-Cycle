import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { AuthContext } from '@/context';
import { BackButton, Button, Input } from '@/components/ui';

interface RegisterProps {
    onClose: () => void;
    onLogin: () => void;
}

export const Register: React.FC<RegisterProps> = ({ onClose, onLogin }) => {
    const auth = useContext(AuthContext);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({
        email: false,
        passwordMismatch: false
    });

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleEmailBlur = () => {
        if (formData.email && !validateEmail(formData.email)) {
            setErrors(prev => ({ ...prev, email: true }));
        } else {
            setErrors(prev => ({ ...prev, email: false }));
        }
    };

    const handlePasswordBlur = () => {
        if (formData.confirmPassword && formData.password !== formData.confirmPassword) {
            setErrors(prev => ({ ...prev, passwordMismatch: true }));
        } else {
            setErrors(prev => ({ ...prev, passwordMismatch: false }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validate before submit
        const emailValid = validateEmail(formData.email);
        const passwordsMatch = formData.password === formData.confirmPassword;

        setErrors({
            email: !emailValid,
            passwordMismatch: !passwordsMatch
        });

        if (!emailValid || !passwordsMatch) {
            return;
        }

        // Register the user
        if (auth?.register) {
            auth.register(formData.name, formData.email);
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="w-full max-w-md bg-white dark:bg-[#1E1E1E] rounded-3xl shadow-2xl overflow-hidden flex flex-col relative max-h-[90vh] overflow-y-auto"
            >
                {/* Header Image */}
                <div className="h-40 relative bg-primary/10 overflow-hidden shrink-0">
                    {/* Ambient Background Glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-primary/20 dark:bg-accent/20 blur-[60px] rounded-full pointer-events-none" />

                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="relative">
                            <div className="absolute inset-0 bg-primary/30 dark:bg-accent/30 blur-xl rounded-full scale-150 animate-pulse" />
                            <span className="relative material-symbols-rounded text-6xl text-primary dark:text-accent drop-shadow-lg">person_add</span>
                        </div>
                    </div>

                    <BackButton
                        onClick={onClose}
                        variant="overlay"
                        className="absolute top-4 left-4"
                    />
                </div>

                {/* Form Content */}
                <div className="p-8 flex flex-col gap-6">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-text dark:text-white mb-2">Crea tu cuenta</h2>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                            Únete a la comunidad de Mineros Urbanos y empieza a reciclar hoy.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <Input
                            label="Nombre Completo"
                            type="text"
                            placeholder="Juan Pérez"
                            icon="person"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />

                        <Input
                            label="Correo Electrónico"
                            type="email"
                            placeholder="juan@ejemplo.com"
                            icon="mail"
                            error={errors.email ? "Inválido" : false}
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            onBlur={handleEmailBlur}
                        />

                        <Input
                            label="Contraseña"
                            type="password"
                            placeholder="••••••••"
                            icon="lock"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />

                        <Input
                            label="Confirmar Contraseña"
                            type="password"
                            placeholder="••••••••"
                            icon="lock_reset"
                            error={errors.passwordMismatch ? "No coinciden" : false}
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            onBlur={handlePasswordBlur}
                        />

                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            fullWidth
                            className="mt-4"
                            icon={<span className="material-symbols-rounded">arrow_forward</span>}
                        >
                            Registrarme
                        </Button>
                    </form>

                    <div className="flex items-center justify-center gap-1 mt-6">
                        <span className="text-sm text-gray-500 dark:text-gray-400">¿Ya tienes cuenta?</span>
                        <Button
                            onClick={onLogin}
                            variant="ghost"
                            size="sm"
                            className="!px-2 h-auto hover:underline"
                        >
                            Iniciar Sesión
                        </Button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
