import type { TawjihiStream, Subject } from './types';

export const tawjihiStreams: { id: TawjihiStream; name: string }[] = [
  { id: 'Scientific', name: 'الفرع العلمي' },
  { id: 'Literary', name: 'الفرع الأدبي' },
  { id: 'IT', name: 'فرع تكنولوجيا المعلومات' },
  { id: 'Health', name: 'الفرع الصحي' },
  { id: 'Industrial', name: 'الفرع الصناعي' },
  { id: 'Hospitality', name: 'الفرع الفندقي والسياحي' },
  { id: 'HomeEconomics', name: 'فرع الاقتصاد المنزلي' },
];

export const commonSubjects: Subject[] = [
  { name: 'التربية الإسلامية', prompt: 'اشرح لي درساً في التربية الإسلامية...' },
  { name: 'اللغة العربية (مشترك)', prompt: 'وضح لي قاعدة في اللغة العربية...' },
  { name: 'اللغة الإنجليزية (مشترك)', prompt: 'Explain a grammar rule in English...' },
  { name: 'تاريخ الأردن', prompt: 'لخص لي حدثاً مهماً في تاريخ الأردن...' },
];

export const subjectsByStream: Record<TawjihiStream, Subject[]> = {
  Scientific: [
    { name: 'الرياضيات', prompt: 'اشرح لي مفهوماً في الرياضيات...' },
    { name: 'الفيزياء', prompt: 'وضح لي قانوناً في الفيزياء...' },
    { name: 'الكيمياء', prompt: 'لخص لي تفاعلاً في الكيمياء...' },
    { name: 'علوم الأرض', prompt: 'ما هي خصائص... في علوم الأرض؟' },
    { name: 'الأحياء', prompt: 'صف لي عملية حيوية في الأحياء...' },
  ],
  Literary: [
    { name: 'العربي تخصص', prompt: 'حلل لي قصيدة في العربي تخصص...' },
    { name: 'الجغرافيا', prompt: 'اشرح لي ظاهرة جغرافية...' },
    { name: 'تاريخ العرب', prompt: 'لخص لي حدثاً في تاريخ العرب...' },
    { name: 'الثقافة المالية', prompt: 'ما هو مفهوم... في الثقافة المالية؟' },
    { name: 'العلوم الإسلامية', prompt: 'وضح لي حكماً في العلوم الإسلامية...' },
  ],
  IT: [
    { name: 'البرمجة', prompt: 'اكتب لي كوداً بسيطاً لحل مشكلة...' },
    { name: 'الشبكات', prompt: 'اشرح لي بروتوكولاً في الشبكات...' },
    { name: 'أمن المعلومات', prompt: 'ما هي طرق الحماية من...؟' },
    { name: 'قواعد البيانات', prompt: 'كيف أصمم جدولاً لـ...؟' },
  ],
  Health: [
    { name: 'العلوم الصحية', prompt: 'اشرح لي مفهوماً في العلوم الصحية...' },
    { name: 'الأحياء', prompt: 'صف لي عملية حيوية في الأحياء...' },
    { name: 'الكيمياء', prompt: 'لخص لي تفاعلاً في الكيمياء...' },
  ],
  Industrial: [
    { name: 'فيزياء صناعي', prompt: 'وضح لي تطبيقاً صناعياً لقانون فيزيائي...' },
    { name: 'رياضيات صناعي', prompt: 'حل لي مسألة في الرياضيات الصناعية...' },
    { name: 'علم الصناعة', prompt: 'اشرح لي عملية... في علم الصناعة.' },
  ],
  Hospitality: [
    { name: 'إدارة الفنادق', prompt: 'ما هي أفضل الممارسات في إدارة الفنادق لـ...؟' },
    { name: 'السياحة والسفر', prompt: 'لخص لي أهمية موقع سياحي أردني...' },
    { name: 'إنتاج الطعام', prompt: 'اشرح لي تقنية في إنتاج الطعام...' },
  ],
  HomeEconomics: [
    { name: 'علوم منزلية', prompt: 'وضح لي مفهوماً في العلوم المنزلية...' },
    { name: 'صحة وغذاء', prompt: 'ما هي فوائد... للصحة؟' },
    { name: 'إدارة منزلية', prompt: 'كيف يمكن إدارة... بفعالية؟' },
  ],
};

const allSubjects = Object.values(subjectsByStream).flat();
export const allUniqueSubjects: Subject[] = [...new Map(allSubjects.map(item => [item.name, item])).values()]
  .sort((a, b) => a.name.localeCompare(b.name, 'ar'));