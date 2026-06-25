import { useFormContext, Controller } from 'react-hook-form';
import { Field, FieldLabel, FieldError } from '../ui/field';
import { Button } from '../ui/button';

interface FormSelectProps {
    name: string
    label: string
    array: { label: string, value: string }[]
}

export default function FormSelect({ name, label, array }: FormSelectProps) {
    const { control, formState } = useFormContext();
    const error = formState.errors[name];

    return (
        <Field data-invalid={!!error} className="flex flex-col gap-2">
            <FieldLabel htmlFor={name}>{label}</FieldLabel>

            <Controller
                name={name}
                control={control}
                render={({ field }) => (
                    <div className="flex flex-wrap gap-3 ">
                        {array.map((item) => {
                            const isSelected = field.value === item.value;
                            return (
                                <Button
                                    key={item.value}
                                    onClick={() => field.onChange(item.value)}
                                    variant="outline"
                                    className={isSelected ? "border-primary bg-primary/10" : ""}
                                >
                                    {item.label}
                                </Button>
                            );
                        })}
                    </div>
                )}
            />

            {error?.message && (
                <FieldError errors={[error]} className='break-all' />
            )}
        </Field>
    );
}
