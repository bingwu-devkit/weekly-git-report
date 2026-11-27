import { ContentSection } from '../components/content-section'
import { AppearanceForm } from './appearance-form'

export function SettingsAppearance() {
  return (
    <ContentSection
      title='外观'
      desc='选择应用界面的深浅色显示主题。'
    >
      <AppearanceForm />
    </ContentSection>
  )
}
