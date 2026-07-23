export function showToast(message: string, type: 'error' | 'info' | 'success' = 'info'): void {
    let container = document.getElementById("toast-container");
    if (!container) {
        container = document.createElement("div");
        container.id = "toast-container";
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            gap: 10px;
            pointer-events: none;
        `;
        document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    const bgColor = type === 'error' ? 'rgba(239, 68, 68, 0.9)' : type === 'success' ? 'rgba(16, 185, 129, 0.9)' : 'rgba(99, 102, 241, 0.9)';
    
    toast.style.cssText = `
        background: ${bgColor};
        color: #ffffff;
        padding: 12px 18px;
        border-radius: 10px;
        font-size: 13px;
        font-weight: 500;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
        backdrop-filter: blur(8px);
        pointer-events: auto;
        transition: all 0.3s ease;
        opacity: 0;
        transform: translateY(-10px);
    `;
    toast.textContent = message;

    container.appendChild(toast);

    requestAnimationFrame(() => {
        toast.style.opacity = "1";
        toast.style.transform = "translateY(0)";
    });

    setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateY(-10px)";
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 3500);
}
