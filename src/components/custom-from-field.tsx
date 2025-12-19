/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { FormFieldType } from '@/constants/enums'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { ControllerRenderProps, FieldValues, Path, useFormContext } from 'react-hook-form'

import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Button } from './ui/button'
import { ChevronDownIcon } from 'lucide-react'
import { Calendar } from './ui/calendar'
import { OptionType } from '@/constants/types'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from './ui/textarea'
import { Checkbox } from './ui/checkbox'
type CustomFromFieldProps<T extends FieldValues> = {
  name: Path<T>
  label?: string
  iconSrc?: string
  iconAlt?: string
  fieldType: FormFieldType
  placeholder?: string
  dateFormat?: string
  showTimeSelect?: boolean
  listValues?: OptionType[]
  renderSkeleton?: (field: ControllerRenderProps<any, any>) => React.ReactNode
} & React.ComponentPropsWithoutRef<typeof Input>

const CustomFromField = <T extends FieldValues>(props: CustomFromFieldProps<T>) => {
  const form = useFormContext<T>()
  return (
    <FormField
      control={form.control}
      name={props.name}
      render={({ field }) => (
        <FormItem className="flex-1">
          {props.label && props.fieldType !== FormFieldType.CHECKBOX && (
            <FormLabel className="text-dark-700 mb-2">{props.label}</FormLabel>
          )}
          <RenderInput field={field} props={props} />
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default CustomFromField

const RenderInput = ({
  field,
  props,
}: {
  fieldType?: FormFieldType
  field: ControllerRenderProps<any, any>
  props: CustomFromFieldProps<any>
} & React.ComponentPropsWithoutRef<typeof Input>) => {
  const form = useFormContext()

  switch (props.fieldType) {
    case FormFieldType.TEXTAREA:
      return (
        <FormControl>
          <Textarea
            placeholder={props.placeholder}
            {...field}
            className={cn(
              props.className,
              'bg-dark-400  border-dark-500 focus-visible:ring-0 focus-visible:ring-offset-0',
            )}
            disabled={props.disabled}
          />
        </FormControl>
      )
    case FormFieldType.INPUT:
      return (
        <div className=" flex items-center  gap-0 rounded-md border border-dark-500 bg-dark-400 ">
          {props.iconSrc && (
            <Image
              src={props.iconSrc}
              alt={props.iconAlt || 'icon'}
              className="ml-1"
              width={24}
              height={24}
            />
          )}
          <FormControl>
            <Input
              disabled={props.disabled}
              {...props}
              type={props.type}
              placeholder={props.placeholder}
              {...field}
              className={cn(
                'border-0 bg-dark-400 ps-2  h-11 focus-visible:ring-0 focus-visible:ring-offset-0  outline-0 shadow-none shadow-0 ring-0',
                props.className,
              )}
            />
          </FormControl>
        </div>
      )
    case FormFieldType.PHONE_INPUT:
      return (
        <FormControl>
          <PhoneInput
            defaultCountry="US"
            international
            withCountryCallingCode
            value={field.value}
            placeholder={props.placeholder || 'Enter phone number'}
            onChange={field.onChange}
            className="phone-input"
          />
        </FormControl>
      )
    case FormFieldType.DATE_PICKER:
      return (
        <div className="flex rounded-lg border border-dark-500 bg-dark-400 shadow-sm w-full max-w-sm">
          <FormControl className="w-full">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-between px-3 py-2 text-sm text-white bg-dark-500 rounded-lg hover:bg-dark-600 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Image
                      src="/assets/icons/calendar.svg"
                      height={20}
                      width={20}
                      alt="calendar"
                      className="inline-block"
                    />
                    <span>{field.value ? field.value.toLocaleDateString() : 'Select date'}</span>
                  </div>
                  <ChevronDownIcon className="ml-2 w-4 h-4 text-gray-300" />
                </Button>
              </PopoverTrigger>

              <PopoverContent
                className="w-auto p-2 bg-dark-400 rounded-lg shadow-lg border border-dark-500"
                align="start"
              >
                <Calendar
                  mode="single"
                  selected={field.value}
                  captionLayout="dropdown"
                  className="bg-dark-400 text-white"
                  onSelect={(date) => field.onChange(date)}
                />
              </PopoverContent>
            </Popover>
          </FormControl>
        </div>
      )
    case FormFieldType.SELECT:
      return (
        <FormControl className="w-full">
          <Select defaultValue={form.getValues(props.name)} onValueChange={field.onChange}>
            <SelectTrigger
              className="
        bg-dark-400 w-full h-11 px-3 rounded-lg border border-dark-500
        text-white placeholder:text-dark-600
        focus:outline-none focus:ring-1 focus:ring-indigo-500
        flex items-center justify-between
      "
            >
              <SelectValue placeholder={props.placeholder} />
            </SelectTrigger>
            <SelectContent className="bg-dark-400 border border-dark-500 rounded-lg shadow-lg">
              <SelectGroup>
                {props.listValues?.map((item, i) => (
                  <SelectItem
                    key={item.value + i}
                    value={item.value}
                    className="
              flex items-center gap-3 px-3 py-2 text-white
              hover:bg-dark-500 cursor-pointer rounded-md transition-colors
            "
                  >
                    {item.imgSrc && (
                      <Image
                        src={item.imgSrc}
                        width={32}
                        height={32}
                        alt={item.label}
                        className="rounded-full border border-dark-500"
                      />
                    )}
                    <span>{item.label}</span>
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </FormControl>
      )
    case FormFieldType.CHECKBOX:
      return (
        <FormControl>
          <div className="flex items-center gap-4">
            <Checkbox
              className=" data-[state=checked]:border-white"
              id={props.name}
              checked={field.value}
              onCheckedChange={field.onChange}
            />
            <label
              htmlFor={props.name}
              className="cursor-pointer text-sm font-medium text-dark-700 peer-disabled:cursor-not-allowed peer-disabled:opacity-70 md:leading-none"
            >
              {props.label}
            </label>
          </div>
        </FormControl>
      )
    case FormFieldType.SKELETON:
      return props.renderSkeleton ? props.renderSkeleton(field) : null
  }
}
