export async function sendContactForm(data: { email: string; phone: string; message: string }) {
    const res = await fetch('/api/contact', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData?.message || 'Failed to send message');
    }

    return res.json();
}
