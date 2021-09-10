# 구글 드라이브에 플랫폼 별 언어셋 추출하기

플랫폼 별 언어셋 추출을 도와줍니다.

##어떻게 동작하나요?

1. 링크를 참고해 구글 드라이브에 엑셀 파일을 만듭니다.:
https://docs.google.com/spreadsheets/d/1H3QRgSZC_27smVWyLGmQlqPwcvyXOO24Sth3-97jkHc
2. 엑셀 파일 메뉴에서 'Tools => Script Editor'로 들어가 소스코드를 붙입니다.
3. "main" 메소드를 실행합니다.

아래와 같은 파일이 생성됩니다.:
```
My Drive
  /Export
    /App Name
      /Android
        /values-en
          /strings.xml
        /values-fr
          /strings.xml
        ...
      /iOS
        /Localizable_EN.strings
        /Localizable_FR.strings
        ...
```

# Android iOS Drive Export

This script aims to help you to manage your strings resources for Android & iOS.

##How it works?

1. Create a spreadsheet on Google Drive with this model:
https://docs.google.com/spreadsheets/d/1H3QRgSZC_27smVWyLGmQlqPwcvyXOO24Sth3-97jkHc
2. Go to Tools => Script Editor and paste the script.
3. Run the method "exportResources".

The script will generate the next folders & files:
```
My Drive
  /Export
    /App Name
      /Android
        /values-en
          /strings.xml
        /values-fr
          /strings.xml
        ...
      /iOS
        /Localizable_EN.strings
        /Localizable_FR.strings
        ...
```

