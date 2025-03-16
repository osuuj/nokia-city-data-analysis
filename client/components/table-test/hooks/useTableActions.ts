// 6. useTableActions.ts
// Main Purpose:
// Manages button actions and refs for UI interactions.

// Main Parts:

// Uses useRef for button references (eyesRef, editRef, deleteRef).
// Implements useButton for getting button properties.
// Ensures stable button event handlers.

const eyesRef = useRef<HTMLButtonElement | null>(null);
    const editRef = useRef<HTMLButtonElement | null>(null);
    const deleteRef = useRef<HTMLButtonElement | null>(null);
    const { getButtonProps: getEyesProps } = useButton({ ref: eyesRef });
    const { getButtonProps: getEditProps } = useButton({ ref: editRef });
    const { getButtonProps: getDeleteProps } = useButton({ ref: deleteRef });
    const getMemberInfoProps = useMemoizedCallback(() => ({
        onClick: handleMemberClick,
    }));
