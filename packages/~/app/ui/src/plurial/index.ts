//

export const FrCardinalRules = new Intl.PluralRules("en-US");

//

export function formattedPlural<TOne extends string, TOther extends string>(
  value: number,
  { one, other }: { one: TOne; other: TOther },
) {
  return FrCardinalRules.select(value) === "one" ? one : other;
}
