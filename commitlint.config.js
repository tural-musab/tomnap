module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // Yeni özellik
        'fix', // Bug düzeltme
        'docs', // Dokümantasyon
        'style', // Kod stili değişiklikleri
        'refactor', // Kod yeniden yapılandırma
        'perf', // Performance iyileştirmeleri
        'test', // Test ekleme/düzeltme
        'chore', // Build, CI vb. değişiklikler
        'revert', // Geri alma
        'build', // Build sistemi değişiklikleri
        'ci', // CI konfigürasyon değişiklikleri
      ],
    ],
    'subject-case': [2, 'never', ['upper-case', 'pascal-case']],
    'subject-min-length': [2, 'always', 3],
    'subject-max-length': [2, 'always', 100],
  },
}
