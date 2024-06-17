export function removeCustomColors() {
    document.documentElement.style.removeProperty('--navbar-color');
    document.documentElement.style.removeProperty('--navbar-border-color');
    document.documentElement.style.removeProperty('--profile-color');
    document.documentElement.style.removeProperty('--primary-color');
    document.documentElement.style.removeProperty('--secondary-color');
}