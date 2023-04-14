import store from "@/store"
import { TagColor } from "@/types/common"

class TagColors {
  public static predefined = [
    { foreground: "white", background: "#803d3d" },
    { foreground: "white", background: "#833e65" },
    { foreground: "white", background: "#492d4e" },
    { foreground: "white", background: "#5b3b80" },
    { foreground: "white", background: "#38406e" },
    { foreground: "white", background: "#013b6a" },
    { foreground: "white", background: "#023f5c" },
    { foreground: "white", background: "#385879" },
    { foreground: "white", background: "#3a7777" },
    { foreground: "white", background: "#326c34" },
    { foreground: "white", background: "#2e521b" },
    { foreground: "white", background: "#44573f" },
    { foreground: "white", background: "#605c2b" },
    { foreground: "white", background: "#846300" },
    { foreground: "white", background: "#895200" },
    { foreground: "white", background: "#7b331e" },
    { foreground: "white", background: "#6e5056" },
    { foreground: "white", background: "#596c71" },
    { foreground: "white", background: "#2a4958" },
    { foreground: "white", background: "#434141" },
  ] as TagColor[]
  private _tagsColors: { [p: string]: TagColor } = {}

  get tags(): string[] {
    return Object.keys(this._tagsColors)
  }

  set tagsColorMap(colors: { [p: string]: TagColor }) {
    this._tagsColors = colors
  }

  getColor(tag: string) {
    const tagColor =
      store.getState().app.preferences.rootProjects?.tagsColors[tag] ??
      this.calcColor(tag)
    this._tagsColors = { ...this._tagsColors, [tag]: tagColor }
    return tagColor
  }

  calcColor(tag: string) {
    const sum = Array.from(tag)
      .map((chr) => chr.charCodeAt(0))
      .reduce((accumulator, currentValue) => accumulator + currentValue, 0)
    return { ...TagColors.predefined[sum % 20] }
  }

  setColor(tag: string, colors: Partial<TagColor>) {
    if (!colors.background || !colors.foreground) {
      const curr = this._tagsColors[tag] || this.calcColor(tag)
      return {
        background: colors.background || curr.background,
        foreground: colors.foreground || curr.foreground,
      }
    } else {
      return colors
    }
  }
}

export const tagColorManager = new TagColors()
