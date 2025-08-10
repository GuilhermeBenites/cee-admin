import { useState } from 'react';

export function useConfirmAction() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [actionToConfirm, setActionToConfirm] = useState<(() => void) | null>(null);

    const openModal = (action: () => void) => {
        setActionToConfirm(() => action);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setActionToConfirm(null);
    };

    const confirm = () => {
        if (actionToConfirm) {
            actionToConfirm();
        }
        closeModal();
    };

    return {
        isModalOpen,
        openModal,
        closeModal,
        confirm,
    };
}
