/**
 * Normalizes options array into standard option object structures
 */
export function normalizeOptions(options = []) {
    return options.map((opt, index) => {
        if (typeof opt === 'string' || typeof opt === 'number') {
            return {
                value: opt,
                label: String(opt),
                disabled: false,
                index,
                original: opt,
            };
        }
        return {
            value: opt.value,
            label: opt.label ?? String(opt.value),
            icon: opt.icon,
            disabled: !!opt.disabled,
            description: opt.description,
            index,
            original: opt,
        };
    });
}
