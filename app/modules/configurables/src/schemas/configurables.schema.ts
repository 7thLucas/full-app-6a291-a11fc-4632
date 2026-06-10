/* START: THIS SECTION CODE IS CANNOT BE CHANGED, YOU ONLY READ IT */
export interface FieldSchemaType {
  fieldName?: string;
  type:
    | "string"
    | "number"
    | "boolean"
    | "object"
    | "array"
    | "color"
    | "url"
    | "enum"
    | "datetime"
    | "file"
    | "files";
  required?: boolean;
  label?: string;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  options?: string[];
  fields?: FieldSchemaType[];
  item?: FieldSchemaType;
}
/* END: THIS SECTION CODE IS CANNOT BE CHANGED, YOU ONLY READ IT */

export type ConfigurableSchemas = {
  formSchema: FieldSchemaType[];
};



export const configurableSchemas: ConfigurableSchemas = {
  formSchema: [
    {
      fieldName: "appName",
      type: "string",
      required: true,
      label: "App Name",
    },
    {
      fieldName: "tagline",
      type: "string",
      required: false,
      label: "Tagline",
    },
    {
      fieldName: "logoUrl",
      type: "url",
      required: true,
      label: "Logo URL",
    },
    {
      fieldName: "brandColor",
      type: "object",
      required: true,
      label: "Brand Color",
      fields: [
        {
          fieldName: "primary",
          type: "color",
          required: true,
          label: "Primary",
        },
        {
          fieldName: "secondary",
          type: "color",
          required: true,
          label: "Secondary",
        },
        {
          fieldName: "accent",
          type: "color",
          required: true,
          label: "Accent",
        },
      ],
    },
    {
      fieldName: "welcomeMessage",
      type: "string",
      required: false,
      label: "Welcome Message",
    },
    {
      fieldName: "coachName",
      type: "string",
      required: false,
      label: "Virtual Coach Name",
    },
    {
      fieldName: "practiceSongs",
      type: "array",
      label: "Practice Songs",
      item: {
        type: "object",
        fields: [
          { fieldName: "id", type: "string", required: true, label: "ID" },
          { fieldName: "title", type: "string", required: true, label: "Song Title" },
          { fieldName: "show", type: "string", required: false, label: "Musical Show" },
          { fieldName: "difficulty", type: "enum", required: false, label: "Difficulty", options: ["beginner", "intermediate", "advanced"] },
          { fieldName: "notes", type: "string", required: false, label: "Notes / Description" },
        ],
      },
    },
    {
      fieldName: "warmUpExercises",
      type: "array",
      label: "Warm-Up Exercises",
      item: {
        type: "object",
        fields: [
          { fieldName: "id", type: "string", required: true, label: "ID" },
          { fieldName: "title", type: "string", required: true, label: "Exercise Title" },
          { fieldName: "description", type: "string", required: false, label: "Description" },
          { fieldName: "durationMinutes", type: "number", required: false, label: "Duration (minutes)" },
        ],
      },
    },
    {
      fieldName: "auditionDate",
      type: "datetime",
      required: false,
      label: "Audition Date",
    },
    {
      fieldName: "auditionSong",
      type: "string",
      required: false,
      label: "Audition Song Title",
    },
    {
      fieldName: "showProgressStreaks",
      type: "boolean",
      required: false,
      label: "Show Progress Streaks",
    },
    {
      fieldName: "homeCtaLabel",
      type: "string",
      required: false,
      label: "Home CTA Button Label",
    },
    {
      fieldName: "practiceCtaLabel",
      type: "string",
      required: false,
      label: "Practice CTA Button Label",
    },
    {
      fieldName: "footerText",
      type: "string",
      required: false,
      label: "Footer Text",
    },
  ],
};
