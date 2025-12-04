module Vutils exposing (..)

import Html exposing (..)
import Html.Attributes exposing (..)

css : String -> List (Attribute msg)
css str = 
    str 
    |> String.split ";" 
    |> List.map String.trim
    |> List.map (String.split ":")
    |> List.map (List.map String.trim)
    |> List.concatMap (\style_def -> 
        case style_def of
            [key, val] -> [style key val]
            _ -> []
        )

row : String -> List (Attribute msg)
row gap = css <| "display: flex; align-items: stretch; gap: " ++ gap ++ ";"

proportion : String -> List (Attribute msg)
proportion n = css <| "flex: " ++ n ++ " " ++ n ++ "auto ;"

widthpc val = css <| "width: " ++ String.fromInt val ++ "%;"

short = css "width: 4em;"

prettyInput : List (Attribute msg)
prettyInput = css "padding: 6px 8px; border: 1px solid #c7cede; border-radius: 6px; background: #f7f9fc; font-size: 13px;"

prettySelect : List (Attribute msg)
prettySelect = css "padding: 6px 8px; border: 1px solid #c7cede; border-radius: 6px; background: #f7f9fc; font-size: 15px; min-height: 34px;"

hpadding em = 
    let p = String.fromInt em in
    css <| "padding-left: " ++ p ++ "em; padding-right: " ++ p ++ "em;"

paddingpx px = css <| "padding: " ++ String.fromInt px ++ "px;"

nowrap = css "white-space: nowrap;"

hmargin em = 
    let p = String.fromInt em in
    css <| "margin-left: " ++ p ++ "em; margin-right: " ++ p ++ "em;"

rightborder = css "border-right: 2px solid black; height: 100%;"

hcenter = css "margin-left: auto; margin-right: auto;"

fullwidth = css "width: 100%;"

paddingTop x = css <| "padding-top: " ++ String.fromInt x ++ "em;"

vline = div (css "border-left: 2px solid black;max-width:0;") []

column : String -> List (Attribute msg)
column gap = css <|"""
    display: flex;
    flex-direction: column;
    gap: """ ++ gap ++ ";"

toSelectChild : String -> Html msg
toSelectChild c = option [value c] [text c]

bold : List (Attribute msg)
bold = css "font-weight: bold; "

miniHead : List (Attribute msg)
miniHead = css "text-align: center; width: 100%;" ++ bold

boldText : String -> Html msg
boldText t = span bold [text t]

redText : List (Attribute msg)
redText = css "color: red"

overlay : List (Attribute msg)
overlay = css """
    position:absolute;
    top:50%;
    left:50%;
    transform:translate(-50%, -50%);
    color: white; background: #666666;
    z-index: 1001;
"""

containerCSS = css """
    min-height: 3.3em;
    background-color: #00008c;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 6px 12px;
    gap: 8px;
"""

headerCSS = css """
    display: inline-flex;
    align-items: center;
    gap: 10px;
    color: white;
    font-size: 1.25em;
    letter-spacing: -0.15px;
    margin: 0;
"""

tudWrapper : Html msg -> Html msg -> Html msg
tudWrapper headerNav content = 
    div (css "max-height: 100vh; display: flex; flex-direction: column;") 
        [ div containerCSS 
              [ div (css "display: inline-flex; align-items: center; gap: 8px;")
                    [ img (src "/TUD_Logo_RGB_horizontal_weiß_de.svg" :: css "max-height: 2.3em; margin:0; padding: 0;") []
                    , h1 headerCSS [text "ConnExplorer"]
                    ]
              , div (css "display: flex; justify-content: flex-end; align-items: center; gap: 8px;")
                    [ headerNav ]
              ]
        , div (css "margin: 0; padding: 0; flex: 1 1 auto; width: 100%; height: auto; min-height: 100vh; background: transparent; box-shadow: none; border: none; overflow: hidden;")
              [ content ]
        ]
