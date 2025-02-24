// Form configuration object
export const formConfig = [
    {
      id: "name",
      type: "text",
      label: "الاسم",
      validation: {
        required: true,
        arabicOnly: true
      },
      section: "basic"
    },
    {
      id: "kinshipRelation",
      type: "select",
      label: "صلة القرابة",
      validation: {
        required: true
      },
      optionsKey: "relationship",
      section: "basic"
    },
    {
      id: "gender",
      type: "select",
      label: "النوع",
      validation: {
        required: true
      },
      optionsKey: "gender",
      section: "basic"
    },
    {
      id: "ageGroup",
      type: "select",
      label: "الفئة العمرية",
      validation: {
        required: true
      },
      optionsKey: "age",
      section: "basic"
    },
    {
      id: "maritalStatus",
      type: "select",
      label: "الحالة الاجتماعية",
      validation: {
        required: true
      },
      optionsKey: "maritalStatus",
      section: "basic"
    },
    {
      id: "hasNationalId",
      type: "select",
      label: "هل لديه رقم قومي؟",
      validation: {
        required: true
      },
      optionsKey: "hasId",
      section: "basic"
    },
    {
      id: "nationalId",
      type: "text",
      label: "الرقم القومي",
      validation: {
        required: true,
        maxLength: 14
      },
      dependsOn: {
        field: "hasNationalId",
        value: "نعم"
      },
      section: "basic",
      placeholder: "14 رقم"
    },
    {
      id: "hasAttendedSchool",
      type: "select",
      label: "هل التحق بالمدرسة؟",
      validation: {
        required: true
      },
      optionsKey: "hasBeenToSchool",
      section: "education"
    },
    {
      id: "wentToSchool",
      type: "select",
      label: "هل سبق له الذهاب للمدرسة؟",
      validation: {
        required: true
      },
      optionsKey: "regularityInStudy",
      section: "education"
    },
    {
      id: "reasonForNotAttending",
      type: "select",
      label: "لماذا لم يذهب للمدرسة؟",
      validation: {
        required: true
      },
      dependsOn: {
        field: "wentToSchool",
        value: "لا"
      },
      options: [
        { id: "tooYoung", name: "دون سن الإلتحاق" },
        { id: "academic", name: "ضعف دراسي/رسوب" },
        { id: "financial", name: "العمل للمساعدة المالية" },
        { id: "marriage", name: "بسبب الزواج" }
      ],
      section: "education"
    },
    {
      id: "lastEducationalStage",
      type: "select",
      label: "ما آخر مرحلة تعليمية التحق بها؟",
      validation: {
        required: true
      },
      dependsOn: {
        field: "wentToSchool",
        value: "نعم"
      },
      optionsKey: "educationLevel",
      section: "education"
    },
    {
      id: "isCurrentlyEnrolled",
      type: "select",
      label: "هل الاسم منتظم في الدراسة لهذا العام؟",
      validation: {
        required: true
      },
      optionsKey: "regularityInStudy",
      section: "education"
    },
    {
      id: "canReadAndWrite",
      type: "select",
      label: "هل يجيد القراءة والكتابة؟",
      validation: {
        required: true
      },
      optionsKey: "canReadAndWrite",
      section: "education"
    },
    // Employment section
    {
      id: "isWorking",
      type: "select",
      label: "هل يعمل؟",
      validation: {
        required: true
      },
      optionsKey: "doesWork",
      section: "employment"
    },
    {
      id: "jobType",
      type: "select",
      label: "ما هو العمل؟",
      validation: {
        required: true
      },
      dependsOn: {
        field: "isWorking",
        value: "نعم"
      },
      optionsKey: "typeOfWork",
      section: "employment"
    },
    {
      id: "sector",
      type: "select",
      label: "ما هو القطاع؟",
      validation: {
        required: true
      },
      dependsOn: {
        field: "isWorking",
        value: "نعم"
      },
      optionsKey: "sector",
      section: "employment"
    },
    {
      id: "workNature",
      type: "select",
      label: "ما هي طبيعة العمل؟",
      validation: {
        required: true
      },
      dependsOn: {
        field: "isWorking",
        value: "نعم"
      },
      optionsKey: "workNature",
      section: "employment"
    },
    {
      id: "notWorkingReason",
      type: "select",
      label: "لماذا لا يعمل؟",
      validation: {
        required: true
      },
      dependsOn: {
        field: "isWorking",
        value: "لا"
      },
      options: [
        { id: "tooYoung", name: "مازال صغير/ة" },
        { id: "sick", name: "مريض/ة" },
        { id: "housewife", name: "ربة منزل" },
        { id: "imprisoned", name: "مسجون" }
      ],
      section: "employment"
    },
    // Health section fields...
    {
      id: "hasHealthIssue",
      type: "select",
      label: "هل يعاني من مرض مزمن أو إعاقة أو مرض نفسي؟",
      validation: {
        required: true
      },
      optionsKey: "hasChronicIllnessOrDisability",
      section: "health"
    },
    {
      id: "chronicDiseases",
      type: "checkbox-group",
      label: "الأمراض المزمنة",
      validation: {
        required: true
      },
      dependsOn: {
        field: "hasHealthIssue",
        value: "نعم"
      },
      optionsKey: "chronicIllnessTypes",
      section: "health",
      showOther: true
    }
  ] as const;