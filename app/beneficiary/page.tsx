import BeneficiaryForm from "@/components/beneficiary-form"
import { ErrorBoundary } from "@/components/error-boundary"

export default function BeneficiaryPage() {
  return (
    <ErrorBoundary>
      <BeneficiaryForm />
    </ErrorBoundary>
  )
}

