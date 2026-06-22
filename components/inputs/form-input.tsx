import { Controller, useFormContext } from 'react-hook-form'
import { Field, FieldLabel, FieldError } from '../ui/field'
import { Input } from '../ui/input'
import { ComponentProps } from 'react'

interface FormInputProps extends ComponentProps<"input"> {
    name: string
    label: string
}

export default function FormInput(props: FormInputProps) {
    const { control } = useFormContext();
    return (
        <Controller
            name={props.name}
            control={control}
            render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={props.name}>
                        {props.label}
                    </FieldLabel>
                    <Input
                        {...field}
                        aria-invalid={fieldState.invalid}
                        {...props}
                    />
                    {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                    )}
                </Field>
            )}
        />
    )
}
