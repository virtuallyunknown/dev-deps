export function validateConfig(value?: string) {
    try {
        if (!value || value.length < 1) {
            return false;
        }

        if (!Array.isArray(JSON.parse(value))) {
            return false;
        }

        return true;

    } catch (error) {
        return false;
    }
}