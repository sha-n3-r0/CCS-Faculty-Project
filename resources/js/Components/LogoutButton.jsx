import { router } from '@inertiajs/react';

export default function LogoutButton({ className = '', children = 'Log Out', ...props }) {
    const handleClick = (e) => {
        e.preventDefault();
        if (
            !window.confirm(
                'Are you sure you want to log out?',
            )
        ) {
            return;
        }
        router.post(route('logout'));
    };

    return (
        <button type="button" onClick={handleClick} className={className} {...props}>
            {children}
        </button>
    );
}
