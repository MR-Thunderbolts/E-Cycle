import React from 'react';
import { Icon } from '../Icon';
import { IconBox, IconBoxProps } from '../IconBox';

interface MenuItemProps {
    icon: string;
    label: string;
    onClick?: () => void;
    rightElement?: React.ReactNode;
    variant?: 'default' | 'danger';
    className?: string;
    iconVariant?: IconBoxProps['variant'];
    showChevron?: boolean;
    description?: string;
    border?: boolean;
}

export const MenuItem: React.FC<MenuItemProps> = ({
    icon,
    label,
    onClick,
    rightElement,
    variant = 'default',
    className = '',
    iconVariant,
    showChevron = true,
    description,
    border = true,
}) => {
    const danger = variant === 'danger';
    const cls = ['ec-menuitem', onClick ? 'ec-menuitem--clickable' : '', border ? 'ec-menuitem--border' : '', className]
        .filter(Boolean)
        .join(' ');
    const content = (
        <>
            <IconBox icon={icon} variant={iconVariant || (danger ? 'danger' : 'secondary')} />
            <div className="ec-menuitem__body">
                <div className={'ec-menuitem__label' + (danger ? ' ec-menuitem__label--danger' : '')}>{label}</div>
                {description && <div className="ec-menuitem__desc">{description}</div>}
            </div>
            {rightElement}
            {!rightElement && showChevron && <Icon name="chevron_right" className="ec-menuitem__chev" />}
        </>
    );

    // A row with its own control (e.g. a Toggle) can't be a <button>: nested interactive elements.
    if (onClick && !rightElement) {
        return <button type="button" className={cls} onClick={onClick}>{content}</button>;
    }
    return <div className={cls} onClick={onClick}>{content}</div>;
};
