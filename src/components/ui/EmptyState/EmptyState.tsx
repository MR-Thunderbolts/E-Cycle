import React, { ReactNode } from 'react';
import { Icon } from '../Icon';

export interface EmptyStateProps {
    icon?: string; // Material Symbol icon name
    title: string;
    description?: string;
    action?: ReactNode;
    className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon = 'inbox', title, description, action, className = '' }) => (
    <div className={['ec-empty', className].filter(Boolean).join(' ')}>
        <div className="ec-empty__iconwrap">
            <div className="ec-empty__blur" />
            <Icon name={icon} className="ec-empty__icon" />
        </div>
        <h3 className="ec-empty__title">{title}</h3>
        {description && <p className="ec-empty__desc">{description}</p>}
        {action && <div>{action}</div>}
    </div>
);
