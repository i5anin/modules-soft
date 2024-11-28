```mermaid
classDiagram
  class PagesOrderDetail {
    +updateFormFields: Array
    +readonlyFormFields: Array
    +fieldValues: Object
    +selectedOrder: Object
    +uniqueTableFields: Array
    +uniqueTableFieldsStrat: Array
    +uniqueTableFieldsTpd: Array
    +fetchOrderData(): Promise
  }

  class Card {
    +updateFormFields: Array
    +readonlyFormFields: Array
    +fieldValues: Object
    +localFieldValues: Object
    +formattedFieldValues: Object
    +getFieldComponent(field): Component
  }

  class EditableField {
    +field: Object
    +modelValue: Any
    +@update:modelValue: Function
  }

  class ReadonlyField {
    +field: Object
    +value: Any
    +color: String
  }

  class CaliberTable {
    +fields: Array
    +data: Array
    +tableTitle: String
    +excluded: Array
  }

  class StrategyTable {
    +fields: Array
    +data: Array
    +tableTitle: String
    +excluded: Array
  }

  class TpdTable {
    +fields: Array
    +data: Array
    +tableTitle: String
    +excluded: Array
  }

%% Связи PagesOrderDetail
  PagesOrderDetail --> Card : uses
  PagesOrderDetail --> CaliberTable : renders
  PagesOrderDetail --> StrategyTable : renders
  PagesOrderDetail --> TpdTable : renders

%% Связи Card
  Card --> EditableField : renders
  Card --> ReadonlyField : renders

```

+ client\src\modules\orders\form-3-nom\components
  + PagesOrderDetail.vue
  + Card.vue
    + EditableField.vue
    + ReadonlyField.vue



```mermaid
 classDiagram
  note "From Duck till Zebra"
  Animal <|-- Duck
  Animal <|-- Fish
  Animal <|-- Zebra
  note for Duck "can fly\ncan swim\ncan dive\ncan help in debugging"

  class Animal {
    +int age
    +String gender
    +isMammal()
    +mate()
  }

  class Duck {
    +String beakColor
    +swim()
    +quack()
  }

  class Fish {
    -int sizeInFeet
    -canEat()
  }

  class Zebra {
    +bool is_wild
    +run()
  }

```

