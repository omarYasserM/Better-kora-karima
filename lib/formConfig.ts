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
    id: "hasMarriedDaughterUnder18",
    type: "select",
    label: "هل لديك ابنة زوجتك تبلغ من العمر 18 عاماً؟",
    validation: {
      required: true
    },
    dependsOn: {
      field: "maritalStatus",
      value: "متزوج"
    },
    optionsKey: "hasMarriedDaughterUnder18",
    section: "basic"
  },
  {
    id: "hasAttendedSchool",
    type: "select",
    label: "هل سبق له الذهاب للمدرسة؟",
    validation: {
      required: true
    },
    optionsKey: "hasBeenToSchool",
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
      field: "hasAttendedSchool",
      value: "نعم"
    },
    optionsKey: "educationLevel",
    section: "education"
  },
  {
    id: "isCurrentlyEnrolled",
    type: "select",
    label: "هل منتظم في الدراسة؟",
    validation: {
      required: true
    },
    dependsOn: {
      field: "hasAttendedSchool",
      value: "نعم"
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
      field: "hasAttendedSchool",
      value: "لا"
    },
    optionsKey: "reasonForNotStudying",
    section: "education"
  },
  {
    id: "specificReasonForNotAttending",
    type: "text",
    label: "سبب عدم الذهاب للمدرسة",
    validation: {
      required: true,
      maxLength: 100
    },
    dependsOn: {
      field: "reasonForNotAttending",
      value: "أخرى"
    },
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
  {
    id: "hasLiteracyCertificate",
    type: "select",
    label: "هل لديه شهادة محو الأمية؟",
    validation: {
      required: true
    },
    dependsOn: {
      field: "hasAttendedSchool",
      value: "لا"
    },
    optionsKey: "literacyCertificate",
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
    id: "hasPrivateBusiness",
    type: "select",
    label: "هل لديه مشروع خاص؟",
    validation: {
      required: true
    },
    optionsKey: "hasPrivateProject",
    section: "employment"
  },
  {
    id: "hasUnusedSkill",
    type: "select",
    label: "هل لديه مهارة او حرفة غير مستخدمة؟",
    validation: {
      required: true
    },
    optionsKey: "hasUnusedSkill",
    section: "employment"
  },
  {
    id: "unusedSkillType",
    type: "select",
    label: "ما هي المهارة أو الحرفة؟",
    validation: {
      required: true
    },
    dependsOn: {
      field: "hasUnusedSkill",
      value: "نعم"
    },
    optionsKey: "unusedSkillType",
    section: "employment"
  },
  {
    id: "specificUnusedSkill",
    type: "text",
    label: "اذكر المهارة او الحرفة",
    validation: {
      required: true,
      maxLength: 100
    },
    dependsOn: {
      field: "unusedSkillType",
      value: "أخرى"
    },
    section: "employment"
  },
  {
    id: "willingToTrain",
    type: "select",
    label: "هل لديه استعداد للتدريب على مهنة او مجال معين؟",
    validation: {
      required: true
    },
    optionsKey: "willingToTrain",
    section: "employment"
  },
  {
    id: "desiredTrainingField",
    type: "select",
    label: "ما هو المجال الذي يريد التدريب عليه؟",
    validation: {
      required: true
    },
    dependsOn: {
      field: "willingToTrain",
      value: "نعم"
    },
    optionsKey: "desiredTrainingField",
    section: "employment"
  },
  {
    id: "specificTrainingField",
    type: "text",
    label: "اذكر المجال الذي يريد التدريب عليه",
    validation: {
      required: true,
      maxLength: 100
    },
    dependsOn: {
      field: "desiredTrainingField",
      value: "أخرى"
    },
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
    id: "healthIssueType",
    type: "select",
    label: "ما هو المرض المزمن أو الإعاقة أو المرض النفسي؟",
    validation: {
      required: true
    },
    dependsOn: {
      field: "hasHealthIssue",
      value: "نعم"
    },
    optionsKey: "disabilityTypes",
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
      field: "healthIssueType",
      value: "مرض مزمن"
    },
    optionsKey: "chronicIllnessTypes",
    section: "health",
    showOther: true
  },
  {
    id: "otherChronicDisease",
    type: "text",
    label: "اذكر المرض المزمن الأخر",
    validation: {
      required: true,
      maxLength: 100
    },
    dependsOn: {
      field: "chronicDiseases",
      value: "أخرى"
    },
    section: "health"
  },
  {
    id: "treatmentLocation",
    type: "select",
    label: "مكان تلقي العلاج",
    validation: {
      required: true
    },
    dependsOn: {
      field: "hasHealthIssue",
      value: "نعم"
    },
    optionsKey: "treatmentLocations",
    section: "health"
  },
  {
    id: "otherTreatmentLocation",
    type: "text",
    label: "اذكر مكان تلقي العلاج",
    validation: {
      required: true,
      maxLength: 100
    },
    dependsOn: {
      field: "treatmentLocation",
      value: "أخرى"
    },
    section: "health"
  },
  {
    id: "medicalExpensesCoverage",
    type: "select",
    label: "كيف تتغطى تكاليف العلاج؟",
    validation: {
      required: true
    },
    dependsOn: {
      field: "hasHealthIssue",
      value: "نعم"
    },
    optionsKey: "treatmentCostsCovered",
    section: "health"
  },
  {
    id: "otherMedicalExpensesCoverage",
    type: "text",
    label: "اذكر التغطية الطبية الأخرى",
    validation: {
      required: true,
      maxLength: 100
    },
    dependsOn: {
      field: "medicalExpensesCoverage",
      value: "أخرى"
    },
    section: "health"
  },
  {
    id: "requiredMedicalAssistance",
    type: "checkbox-group",
    label: "ما هو احتياجك من المؤسسة؟",
    validation: {
      required: true
    },
    dependsOn: {
      field: "hasHealthIssue",
      value: "نعم"
    },
    optionsKey: "requiredMedicalAssistance",
    section: "health"
  },
  {
    id: "otherRequiredMedicalAssistance",
    type: "text",
    label: "اذكر الاحتياج الطبي الأخر",
    validation: {
      required: true,
      maxLength: 100
    },
    dependsOn: {
      field: "requiredMedicalAssistance",
      value: "أخرى"
    },
    section: "health"
  },
  {
    id: "hasFGM",
    type: "select",
    label: "هل قمت بعملية الختان؟",
    validation: {
      required: true
    },
    dependsOn: {
      field: "gender",
      value: "أنثى"
    },
    optionsKey: "hadCircumcision",
    section: "health"
  },
  {
    id: "whereFGM",
    type: "select",
    label: "من قام بعملية الختان؟",
    validation: {
      required: true
    },
    dependsOn: {
      field: "hasFGM",
      value: "نعم"
    },
    optionsKey: "circumcisionPerformer",
    section: "health"
  },
  {
    id: "otherWhereFGM",
    type: "text",
    label: "اذكر من قام بعملية الختان",
    validation: {
      required: true,
      maxLength: 100
    },
    dependsOn: {
      field: "whereFGM",
      value: "أخرى"
    },
    section: "health"
  }
] as const;