port module Main exposing (..)

import Browser exposing (UrlRequest(..))
import Browser.Navigation exposing (Key)

import Url
import Url.Builder as UB
import Url.Parser as UP exposing ((</>), (<?>))
import Url.Parser.Query as UQ

import Json.Decode as D
import Json.Encode as E

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)

import Keyboard.Key 
import Vutils exposing (..)
import Platform.Cmd as Cmd

import List.Nonempty as LNE
import Dict.Nonempty as DNE
import Browser.Navigation exposing (load)
import Keyboard.Event exposing (KeyboardEvent)
import Dict

type Model 
  = WaitingForInitData Key Url.Url (Maybe SharedInfos)
  | WaitingForFirstImage InitData Key Url.Url (Maybe SharedInfos)
  | Running RtData
  | Error String

type alias SharedInfos =
  { atlas: String
  , img: String
  , lcmap: String
  , rcmap: String
  , idx4d: Int
  , lx1: String
  , lx2: String
  , lx3: String
  , llow: String
  , lhigh: String
  , lthreshl: String
  , lthreshh: String
  , rx1: String
  , rx2: String
  , rx3: String
  , rlow: String
  , rhigh: String
  , rthreshl: String
  , rthreshh: String
  }

type alias RtData = 
  { initData: InitData
  , img: String
  , info_l: SideInfo
  , info_r: SideInfo
  , idx4d: Int
  , activeSide: Side
  , currentAtlas: String
  , currentImg: String
  , invalidMniCoord: Bool
  , key: Key
  , url: Url.Url
  , showShareDialog: Bool
  , matrixBundle: Maybe MatrixBundle
  , matrixFixedRange: MaybeHighLowPair
  , matrixLabelsOn: Bool
  , matrixFocusRange: Maybe ((Int, Int), (Int, Int))
  , matrixHemisphere: Hemisphere
  , loading: Bool
  }

type Side = Left | Right
type CoordIdx = X1 | X2 | X3
type HighOrLow = Low | High

type InputField = X1I | X2I | X3I | Vlow | Vhigh | ThreshHigh | ThreshLow
type alias InputId = (InputField, Side)

type alias RegionLabel = 
  { vol: String
  , name: String 
  }

type alias ClickMeta =
  { offsetX : Float
  , offsetY : Float
  , width : Float
  , height : Float
  , ctrl : Bool
  }

type alias ColorOption =
  { name : String
  , gradient : String
  , category : String
  }

type Event
  = RecvFS String
  | EvSelectedAtlas String
  | EvSelected4DImg String
  | EvSideSelect String
  | EvUpdateCoord CoordIdx String
  | EvUpdateVRange HighOrLow String
  | EvUpdateThresh HighOrLow String
  | EvUpdateCMapLeft String
  | EvUpdateCMapRight String
  | EvRequestNewImage
  | EvImageClick ClickMeta
  | EvLinkClicked UrlRequest
  | EvUrlChanged Url.Url
  | EvShareButtonPressed
  | EvCloseDialog
  | EvAdjustInput InputId Int
  | EvMatrixClicked Int Int
  | EvToggleMatrixLabels Bool
  | EvSetHemisphere String
  | EvClearMatrixFocus

type MsgFromServer
  = MFSImg String (Maybe RegionLabel) (Maybe RegionLabel) (Maybe MatrixBundle) (Maybe Float) (Maybe Float) (Maybe String) (Maybe String) (Maybe MaybeHighLowPair) (Maybe MaybeHighLowPair)
  | MFSImgWithPos String (Maybe RegionLabel) (Maybe RegionLabel) MaybeCoords MaybeCoords Int (Maybe MatrixBundle) (Maybe Float) (Maybe Float) (Maybe String) (Maybe String) (Maybe MaybeHighLowPair) (Maybe MaybeHighLowPair)
  | MFSInitData InitData
  | MFSDeathRattle
  | MFSUnknown

type alias InitData =   
  { atlas_image_map: DNE.NonemptyDict String (LNE.Nonempty String)
  , min_mni: Coords
  , max_mni: Coords
  , cmaps: List String
  }

type alias GetImageData = 
  { atlasName: String
  , imgName: String
  , idx4d: Int
  , infosL: SideInfo
  , infosR: SideInfo
  }

type alias SideInfo = 
  { coords: StringCoords
  , vrange: StringHighLowPair
  , threshold: StringHighLowPair
  , smoothed: Bool
  , label: Maybe RegionLabel
  , value: Maybe Float
  , color: Maybe String
  , cmap: String
  }

type alias StringCoords = 
  { x1: String
  , x2: String
  , x3: String
  }

type alias MaybeCoords = 
  { x1: Maybe Int
  , x2: Maybe Int
  , x3: Maybe Int
  }

type alias Coords = 
  { x1: Int
  , x2: Int
  , x3: Int
  }

type alias MaybeHighLowPair = 
  { low: Maybe Float
  , high: Maybe Float
  }

type alias StringHighLowPair = 
  { low: String
  , high: String
  }

type alias MatrixSlice =
  { axis : String
  , index : Int
  , values : List (List (Maybe Float))
  , rawValues : List (List (Maybe Float))
  , vrange : MaybeHighLowPair
  , cmap : String
  , showLabels : Bool
  , netBoundaries : List Int
  , netBoundariesY : List Int
  , netLabels : List String
  , netLabelsFull : List String
  , netLabelsY : List String
  , netLabelsFullY : List String
  , netMembers : List (List Int)
  , netMemberIndices : List (List Int)
  , showRegionLabels : Bool
  , showNetworkLabels : Bool
  , xLabels : List String
  , yLabels : List String
  , xShortLabels : List String
  , yShortLabels : List String
  , xIds : List Int
  , yIds : List Int
  , xCenters : List (List Float)
  , yCenters : List (List Float)
  , xNets : List String
  , yNets : List String
  , xNetsFull : List String
  , yNetsFull : List String
  , selectedRowId : Int
  , selectedColId : Int
  , xDlim : List Int
  , yDlim : List Int
  , xLabelRaw : List String
  , yLabelRaw : List String
  }

type alias MatrixBundle =
  { region : MatrixSlice
  }
type Hemisphere = BothHemis | LeftHemis | RightHemis


type MsgToServer 
  = MTSGetImg GetImageData
  | MTSGetImgWithClick GetImageData Pos Bool
  | MTSGetInitData

type alias Pos = (Float, Float)

port sendMessage : String -> Cmd msg
port messageReceiver : (String -> msg) -> Sub msg
port renderMatrix : E.Value -> Cmd msg
port matrixClicked : ({row : Int, col : Int} -> msg) -> Sub msg


main : Program () Model Event
main =
  Browser.application
    { init = init
    , view = renderPage
    , update = update
    , subscriptions = subscriptions
    , onUrlRequest = EvLinkClicked
    , onUrlChange = EvUrlChanged
    }


init : () -> Url.Url -> Key -> ( Model, Cmd Event )
init () url key = 
  let
    sharedData =
      case parseShareLink url of
        Ok sd -> sd
        Err _ -> Nothing
  in
  ( WaitingForInitData key url sharedData, Cmd.none )


parseShareLink : Url.Url -> Result String (Maybe SharedInfos)
parseShareLink url =
    if url.path == "/" 
    then Ok Nothing
    else 
      let 
        parser = UP.s "index.html" 
          <?> UQ.string "atlas"
          <?> UQ.string "img"
          <?> UQ.string "cmap_l"
          <?> UQ.string "cmap_r"
          <?> UQ.int "idx4d"
          <?> UQ.string "lx1"
          <?> UQ.string "lx2"
          <?> UQ.string "lx3"
          <?> UQ.string "llow"
          <?> UQ.string "lhigh"
          <?> UQ.string "lthreshl"
          <?> UQ.string "lthreshh"
          <?> UQ.string "rx1"
          <?> UQ.string "rx2"
          <?> UQ.string "rx3"
          <?> UQ.string "rlow"
          <?> UQ.string "rhigh"
          <?> UQ.string "rthreshl"
          <?> UQ.string "rthreshh"
          |> UP.map maybeSharedInfos
      in
      case UP.parse parser url of
        Just (Just infos) -> Ok (Just infos)
        _ -> Err <| "Invalid URL-path:" ++ url.path


maybeSharedInfos : Maybe String -> Maybe String -> Maybe String -> Maybe String -> Maybe Int -> Maybe String -> Maybe String -> Maybe String -> Maybe String -> Maybe String -> Maybe String -> Maybe String -> Maybe String -> Maybe String -> Maybe String -> Maybe String -> Maybe String -> Maybe String -> Maybe String -> Maybe SharedInfos
maybeSharedInfos mbArg1 mbArg2 mbArg3 mbArg4 mbArg5 mbArg6 mbArg7 mbArg8 mbArg9 mbArg10 mbArg11 mbArg12 mbArg13 mbArg14 mbArg15 mbArg16 mbArg17 mbArg18 mbArg19 =
    mbArg1 |> Maybe.andThen (\g1 ->
    mbArg2 |> Maybe.andThen (\g2 ->
    mbArg3 |> Maybe.andThen (\g3 ->
    mbArg4 |> Maybe.andThen (\g4 ->
    mbArg5 |> Maybe.andThen (\g5 ->
    mbArg6 |> Maybe.andThen (\g6 ->
    mbArg7 |> Maybe.andThen (\g7 ->
    mbArg8 |> Maybe.andThen (\g8 ->
    mbArg9 |> Maybe.andThen (\g9 ->
    mbArg10 |> Maybe.andThen (\g10 ->
    mbArg11 |> Maybe.andThen (\g11 ->
    mbArg12 |> Maybe.andThen (\g12 ->
    mbArg13 |> Maybe.andThen (\g13 ->
    mbArg14 |> Maybe.andThen (\g14 ->
    mbArg15 |> Maybe.andThen (\g15 ->
    mbArg16 |> Maybe.andThen (\g16 ->
    mbArg17 |> Maybe.andThen (\g17 ->
    mbArg18 |> Maybe.andThen (\g18 ->
    mbArg19 |> Maybe.andThen (\g19 ->
    Just <| SharedInfos g1 g2 g3 g4 g5 g6 g7 g8 g9 g10 g11 g12 g13 g14 g15 g16 g17 g18 g19)))))))))))))))))))


floatUrlParser : String -> UQ.Parser (Maybe Float)
floatUrlParser name = UQ.custom name 
  (\l -> case l of
    [ val ] -> String.toFloat val
    _ -> Nothing
  )

update : Event -> Model -> ( Model, Cmd Event )
update msg model =
  case model of
    WaitingForInitData key url sharedData -> updateWaitingForInitData msg key url sharedData
    WaitingForFirstImage initData key url sharedData -> updateWaitingForFirstImage initData key url msg sharedData
    Running rtData -> updateRunning rtData msg
    Error _ -> ( model, Cmd.none) -- we don't process events in the error state any more



updateRunning : RtData -> Event -> ( Model, Cmd Event )
updateRunning rtData ev = case ev of
  RecvFS msg -> case decodeServerMsg msg of
    Ok (MFSImg img left_label right_label matrixBundle value_l value_r color_l color_r vrange_l vrange_r) -> 
      let 
        overlayRange = stringPairToMaybeRange rtData.info_r.vrange
        fallbackRange = MaybeHighLowPair (Just -2) (Just 2)
        fixedRange =
          case ( overlayRange.low, overlayRange.high ) of
            ( Just _, Just _ ) ->
              overlayRange
            _ ->
              matrixBundle
                |> Maybe.andThen matrixBundleRange
                |> Maybe.withDefault rtData.matrixFixedRange
                |> (\r ->
                      case ( r.low, r.high ) of
                        ( Just _, Just _ ) -> r
                        _ -> fallbackRange
                   )
        baseData =
          { rtData
            | img = img
            , info_l = rtData.info_l |> setOverlayInfo left_label value_l color_l |> setRangeFromServer vrange_l
            , info_r = rtData.info_r |> setOverlayInfo right_label value_r color_r |> setRangeFromServer vrange_r
            , matrixBundle = matrixBundle |> Maybe.map (applyBundleCmap (getMatrixCmap rtData))
            , matrixFixedRange = fixedRange
            , matrixLabelsOn = rtData.matrixLabelsOn
            , loading = False
          }
        cmds =
          Cmd.batch
            [ matrixPortCmd baseData
            ]
      in
      (Running baseData, cmds)
    Ok (MFSImgWithPos img leftLabel rightLabel l_coords r_coords idx4d matrixBundle value_l value_r color_l color_r vrange_l vrange_r) ->
      let 
        overlayRange = stringPairToMaybeRange rtData.info_r.vrange
        fallbackRange = MaybeHighLowPair (Just -2) (Just 2)
        fixedRange =
          case ( overlayRange.low, overlayRange.high ) of
            ( Just _, Just _ ) ->
              overlayRange
            _ ->
              matrixBundle
                |> Maybe.andThen matrixBundleRange
                |> Maybe.withDefault rtData.matrixFixedRange
                |> (\r ->
                      case ( r.low, r.high ) of
                        ( Just _, Just _ ) -> r
                        _ -> fallbackRange
                   )
        base =
          { rtData
            | info_l =
                rtData.info_l
                  |> updateCoords (\_ -> coordsToString l_coords)
                  |> setOverlayInfo leftLabel value_l color_l
                  |> setRangeFromServer vrange_l
            , info_r =
                rtData.info_r
                  |> updateCoords (\_ -> coordsToString r_coords)
                  |> setOverlayInfo rightLabel value_r color_r
                  |> setRangeFromServer vrange_r
            , img = img
            , idx4d = idx4d
            , matrixBundle = matrixBundle |> Maybe.map (applyBundleCmap (getMatrixCmap rtData))
            , matrixFixedRange = fixedRange
            , matrixLabelsOn = rtData.matrixLabelsOn
            , loading = False
          }
        cmds =
          Cmd.batch
            [ matrixPortCmd base
            ]
      in
      (Running base, cmds)
    Ok (MFSDeathRattle) -> (Error "There was a Server error, please reload the page", Cmd.none)
    Ok MFSUnknown -> (Running rtData, Cmd.none)
    Ok mfs -> unexpectedMFS (Running rtData) mfs
    Err e -> errorStateFromDecoding e msg

  EvSelectedAtlas newAtlas -> 
    let 
      newRtData =
        { rtData
          | currentAtlas = newAtlas
          , currentImg =
              DNE.get newAtlas rtData.initData.atlas_image_map
                |> Maybe.map LNE.head
                |> Maybe.withDefault rtData.currentImg
          , idx4d = 0
          , info_l = reset_side_all rtData.info_l
          , info_r = reset_side_all rtData.info_r
          , matrixFixedRange = MaybeHighLowPair Nothing Nothing
          , matrixLabelsOn = rtData.matrixLabelsOn
          , loading = True
        }
          |> clearMatrix
    in
    (Running newRtData, requestNewImage newRtData)

  EvSelected4DImg currentImg -> 
    let 
      newRtData = {rtData | currentImg=currentImg,
                            info_r = reset_side_all rtData.info_r }
                    |> clearMatrix
    in
    (Running { newRtData | loading = True }, requestNewImage newRtData)

  EvSideSelect newSide -> case newSide of
    "Left" -> (Running {rtData | activeSide = Left}, Cmd.none)
    "Right" -> (Running {rtData | activeSide = Right}, Cmd.none)
    inval -> (Error <| "Invalid side: " ++ inval, Cmd.none)

  EvUpdateCoord idx val -> 
    (Running <| updateActiveSide (updateCoords <| updateCoord idx val) rtData, Cmd.none)

  EvUpdateVRange idx val ->
    let
      updateFn =
        updateActiveSide <| updateVRange <| updateHLPairVal idx val

      updated = updateFn rtData

      updatedWithMatrixRange =
        if rtData.activeSide == Right then
          let
            range = stringPairToMaybeRange updated.info_r.vrange
          in
          case ( range.low, range.high ) of
            ( Just _, Just _ ) ->
              { updated | matrixFixedRange = range }

            _ ->
              updated
        else
          updated
    in
    (Running updatedWithMatrixRange, matrixPortCmd updatedWithMatrixRange)

  EvUpdateThresh idx val ->
    let updateFn = updateActiveSide <| updateThresh <| updateHLPairVal idx val in
    (Running <| updateFn rtData, Cmd.none)

  EvUpdateCMapLeft val ->
    let
      newData =
        { rtData | info_l = updateCmap val rtData.info_l }
          |> clearMatrix
    in
    (Running { newData | loading = True }, requestNewImage newData)

  EvUpdateCMapRight val ->
    let
      newData =
        { rtData | info_r = updateCmap val rtData.info_r }
          |> clearMatrix
    in
    (Running { newData | loading = True }, requestNewImage newData)

  EvRequestNewImage -> 
    if allMniCoordsValid rtData
    then 
      let cleared = clearMatrix rtData in
      (Running {cleared | invalidMniCoord = False, loading = True, matrixFocusRange = Nothing}, requestNewImage cleared)
    else (Running {rtData | invalidMniCoord = True}, Cmd.none)

  EvImageClick click ->
    let
      relX =
        if click.width <= 0 then
          0
        else
          click.offsetX / click.width

      relY =
        if click.height <= 0 then
          0
        else
          click.offsetY / click.height

      relCoords =
        ( Basics.clamp 0 1 relX, Basics.clamp 0 1 relY )

      cleared =
        clearMatrix rtData
    in
    ( Running { cleared | loading = False, matrixFocusRange = Nothing }
    , requestFromClick cleared relCoords click.ctrl
    )

  EvShareButtonPressed -> (Running {rtData | showShareDialog = True}, Cmd.none)

  EvCloseDialog -> (Running {rtData | showShareDialog = False}, Cmd.none)
  EvClearMatrixFocus ->
    (Running { rtData | matrixFocusRange = Nothing }, matrixPortCmd { rtData | matrixFocusRange = Nothing })

  EvLinkClicked req -> 
    case req of 
      External link -> (Running rtData, load link )
      Internal link -> (Running rtData, link |> Url.toString |> load)

  EvAdjustInput fieldId val ->
    let newData = adjustInputValue fieldId val rtData |> clearMatrix in
    (Running {newData | loading = True}, requestNewImage newData)

  EvMatrixClicked row col ->
    case matrixSliceFromBundle rtData of
      Nothing ->
        (Running rtData, Cmd.none)

      Just slice ->
        let
          sourceId = getAt row slice.yIds |> Maybe.withDefault rtData.idx4d
          targetId = getAt col slice.xIds |> Maybe.withDefault rtData.idx4d
          srcCoord = getAt row slice.yCenters |> Maybe.andThen toCoordsMaybe
          tgtCoord = getAt col slice.xCenters |> Maybe.andThen toCoordsMaybe

          updateCoordsIf side mbCoord rt =
            case mbCoord of
              Nothing -> rt
              Just c -> updateSideCoords side (coordsToString c) rt

          rtWithIds =
            { rtData | idx4d = sourceId }
              |> updateCoordsIf Left srcCoord
              |> updateCoordsIf Right tgtCoord
              |> clearMatrix
        in
        ( Running { rtWithIds | loading = True, matrixFocusRange = Nothing }
        , requestNewImage { rtWithIds | matrixFocusRange = Nothing }
        )

  EvToggleMatrixLabels flag ->
    let
      newRt = { rtData | matrixLabelsOn = flag }
    in
    (Running newRt, matrixPortCmd newRt)

  EvSetHemisphere val ->
    let
      hemi = hemisphereFromString val
      newRt = { rtData | matrixHemisphere = hemi }
    in
    (Running newRt, matrixPortCmd newRt)

  other ->
    (Error "Unexpected event received", Cmd.none)


reset_coords : SideInfo -> SideInfo
reset_coords sideInfo = {sideInfo | coords = StringCoords "0" "0" "0"}

reset_vrange : SideInfo -> SideInfo
reset_vrange sideInfo = { sideInfo | vrange = StringHighLowPair "-" "-", threshold = StringHighLowPair "-" "-" }

clear_overlay : SideInfo -> SideInfo
clear_overlay sideInfo = { sideInfo | label = Nothing, value = Nothing, color = Nothing }

reset_side_all : SideInfo -> SideInfo
reset_side_all sideInfo =
  sideInfo
    |> reset_coords
    |> reset_vrange
    |> clear_overlay

    

clearMatrix : RtData -> RtData
clearMatrix rtData =
  { rtData
    | matrixBundle = Nothing
    , matrixFixedRange = MaybeHighLowPair Nothing Nothing
    , matrixFocusRange = Nothing
  }


getAt : Int -> List a -> Maybe a
getAt idx list =
  list |> List.drop idx |> List.head


toCoordsMaybe : List Float -> Maybe MaybeCoords
toCoordsMaybe l =
  case l of
    [x1, x2, x3] ->
      Just <| MaybeCoords (Just (round x1)) (Just (round x2)) (Just (round x3))
    _ ->
      Nothing


updateSideCoords : Side -> StringCoords -> RtData -> RtData
updateSideCoords side coordsStr rt =
  case side of
    Left -> { rt | info_l = updateCoords (\_ -> coordsStr) rt.info_l }
    Right -> { rt | info_r = updateCoords (\_ -> coordsStr) rt.info_r }


adjustInputValue : InputId -> Int -> RtData -> RtData
adjustInputValue (field, side) offset rtData =
  let 
    adjustField targetField si = case targetField of 
      X1I -> si |> updateCoords (updateCoord X1 (stringAdd si.coords.x1 offset))
      X2I -> si |> updateCoords (updateCoord X2 (stringAdd si.coords.x2 offset))
      X3I -> si |> updateCoords (updateCoord X3 (stringAdd si.coords.x3 offset))
      Vlow -> si |> updateVRange (updateHLPairVal Low (stringAdd si.vrange.low offset))
      Vhigh -> si |> updateVRange (updateHLPairVal High (stringAdd si.vrange.high offset))
      ThreshHigh -> si |> updateThresh (updateHLPairVal High (stringAdd si.threshold.high offset))
      ThreshLow -> si |> updateThresh (updateHLPairVal Low (stringAdd si.threshold.low offset))
  in
  case side of
    Left -> { rtData | info_l = adjustField field rtData.info_l }
    Right -> { rtData | info_r = adjustField field rtData.info_r }


stringAdd : String -> Int -> String
stringAdd val offset =
  case String.toInt val of 
    Just ival -> String.fromInt <| ival + offset
    Nothing -> val


withLabel : Maybe RegionLabel -> SideInfo -> SideInfo
withLabel label sideInfo = { sideInfo | label = label }

withValue : Maybe Float -> SideInfo -> SideInfo
withValue value sideInfo = { sideInfo | value = value }

withColor : Maybe String -> SideInfo -> SideInfo
withColor colorVal sideInfo = { sideInfo | color = colorVal }

setOverlayInfo : Maybe RegionLabel -> Maybe Float -> Maybe String -> SideInfo -> SideInfo
setOverlayInfo label value color =
  withLabel label >> withValue value >> withColor color

setRangeFromServer : Maybe MaybeHighLowPair -> SideInfo -> SideInfo
setRangeFromServer mbRange sideInfo =
  case mbRange of
    Nothing ->
      sideInfo
    Just { low, high } ->
      let
        toStr v =
          case v of
            Just x -> String.fromFloat x
            Nothing -> "-"
      in
      { sideInfo | vrange = StringHighLowPair (toStr low) (toStr high) }


allMniCoordsValid : RtData -> Bool
allMniCoordsValid rtData =
    (coordsValid rtData.initData <| parseCoords rtData.info_l.coords)
      && (coordsValid rtData.initData <| parseCoords rtData.info_r.coords)


coordsValid : InitData -> MaybeCoords -> Bool
coordsValid initData mbCoords =
    (isValid X1 mbCoords initData)
    && (isValid X2 mbCoords initData)
    && (isValid X3 mbCoords initData)


coordsToString : MaybeCoords -> StringCoords
coordsToString {x1, x2, x3} =
    let 
      fToS = \f -> case f of 
        Just x -> String.fromInt x
        Nothing -> "-"
    in
    StringCoords (fToS x1) (fToS x2) (fToS x3)
      

isValid : CoordIdx -> MaybeCoords -> InitData -> Bool
isValid coordIdx mbCoords initData =
    getMbCoordAtIdx coordIdx mbCoords
      |> Maybe.map (\i -> 
            let 
              min_v = getCoordAtIdx coordIdx initData.min_mni      
              max_v = getCoordAtIdx coordIdx initData.max_mni
            in
            min_v <= i && i <= max_v)
        -- a string that is not a coord is not the same
        -- as an string that is a coord that is not valid
        |> Maybe.withDefault True


getCoordAtIdx : CoordIdx -> Coords -> Int
getCoordAtIdx idx coords =
    case idx of
      X1 -> coords.x1
      X2 -> coords.x2
      X3 -> coords.x3

      
getMbCoordAtIdx : CoordIdx -> MaybeCoords -> Maybe Int
getMbCoordAtIdx idx coords =
    case idx of
      X1 -> coords.x1
      X2 -> coords.x2
      X3 -> coords.x3
    

clickDecoder : D.Decoder ClickMeta
clickDecoder =
  D.map5 ClickMeta
    (D.field "offsetX" D.float)
    (D.field "offsetY" D.float)
    (D.at [ "currentTarget", "clientWidth" ] D.float)
    (D.at [ "currentTarget", "clientHeight" ] D.float)
    (D.field "ctrlKey" D.bool)


requestFromClick : RtData -> Pos -> Bool -> Cmd Event
requestFromClick rtData pos ctrlIsHeld =
  let data = toImgRequest rtData in
  MTSGetImgWithClick data pos ctrlIsHeld |> encodeMsgToServer |> sendMessage


requestNewImage : RtData -> Cmd Event
requestNewImage rtData = toImgRequest rtData |> MTSGetImg |> encodeMsgToServer |> sendMessage


matrixPortCmd : RtData -> Cmd Event
matrixPortCmd rtData =
  case matrixSliceFromBundle rtData of
    Nothing -> Cmd.none
    Just slice ->
      let
        overlayRange = stringPairToMaybeRange rtData.info_r.vrange
        fallbackRange = MaybeHighLowPair (Just -2) (Just 2)
        fixedRange =
          case ( overlayRange.low, overlayRange.high ) of
            ( Just _, Just _ ) ->
              overlayRange
            _ ->
              case ( rtData.matrixFixedRange.low, rtData.matrixFixedRange.high ) of
                ( Just _, Just _ ) ->
                  rtData.matrixFixedRange
                _ ->
                  fallbackRange
      in
      renderMatrix (encodeMatrixSlice fixedRange rtData.matrixLabelsOn rtData.matrixFocusRange slice)


encodeMatrixSlice : MaybeHighLowPair -> Bool -> Maybe (( Int, Int ), ( Int, Int )) -> MatrixSlice -> E.Value
encodeMatrixSlice fixedRange labelsOn focusRange slice =
  let
    vrangeOverride =
      case ( fixedRange.low, fixedRange.high ) of
        ( Just _, Just _ ) ->
          fixedRange

        _ ->
          MaybeHighLowPair Nothing Nothing
    isNetwork = slice.axis == "networks"
    cols =
      List.length slice.xIds

    rows =
      List.length slice.yIds
    showRegionLabels =
      labelsOn && slice.showLabels && slice.showRegionLabels
    showNetworkLabels =
      labelsOn && slice.showNetworkLabels

    clampRange total (lo, hi) =
      let
        l = Basics.max 0 lo
        h = Basics.min total hi
      in
      if h - l <= 0 then
        Nothing
      else
        Just ( l, h )

    focusVals =
      if isNetwork then
        Nothing
      else
        case focusRange of
          Just ((ys, ye), (xs, xe)) ->
            let
              xClamp = clampRange cols ( xs, xe )
              yClamp = clampRange rows ( ys, ye )
            in
            case ( yClamp, xClamp ) of
              (Just (ys1, ye1), Just (xs1, xe1)) ->
                Just { xs = xs1, xe = xe1, ys = ys1, ye = ye1 }
              _ ->
                Nothing
          Nothing ->
            Nothing
  in
  E.object
    [ ("targetId", E.string "matrix-plot")
    , ("axis", E.string slice.axis)
    , ("index", E.int slice.index)
    , ("values", encodeMatrixValues slice.values)
    , ("raw_values", encodeMatrixValues slice.rawValues)
    , ("vrange", encodeMaybeHighLow vrangeOverride)
    , ("cmap", E.string slice.cmap)
    , ("showLabels", E.bool labelsOn)
    , ("showRegionLabels", E.bool showRegionLabels)
    , ("showNetworkLabels", E.bool showNetworkLabels)
    , ("net_boundaries", E.list E.int slice.netBoundaries)
    , ("net_boundaries_y", E.list E.int slice.netBoundariesY)
    , ("net_labels", E.list E.string slice.netLabels)
    , ("net_labels_full", E.list E.string slice.netLabelsFull)
    , ("net_labels_y", E.list E.string slice.netLabelsY)
    , ("net_labels_full_y", E.list E.string slice.netLabelsFullY)
    , ("net_members", E.list (E.list E.int) slice.netMembers)
    , ("net_member_indices", E.list (E.list E.int) slice.netMemberIndices)
    , ("xFocusStart", focusVals |> Maybe.map (\f -> E.int f.xs) |> Maybe.withDefault (E.int -1))
    , ("xFocusEnd", focusVals |> Maybe.map (\f -> E.int f.xe) |> Maybe.withDefault (E.int -1))
    , ("yFocusStart", focusVals |> Maybe.map (\f -> E.int f.ys) |> Maybe.withDefault (E.int -1))
    , ("yFocusEnd", focusVals |> Maybe.map (\f -> E.int f.ye) |> Maybe.withDefault (E.int -1))
    , ("xLabels", E.list E.string slice.xLabels)
    , ("yLabels", E.list E.string slice.yLabels)
    , ("xShortLabels", E.list E.string slice.xShortLabels)
    , ("yShortLabels", E.list E.string slice.yShortLabels)
    , ("xIds", E.list E.int slice.xIds)
    , ("yIds", E.list E.int slice.yIds)
    , ("xCenters", E.list (E.list E.float) slice.xCenters)
    , ("yCenters", E.list (E.list E.float) slice.yCenters)
    , ("x_nets", E.list E.string slice.xNets)
    , ("y_nets", E.list E.string slice.yNets)
    , ("x_nets_full", E.list E.string slice.xNetsFull)
    , ("y_nets_full", E.list E.string slice.yNetsFull)
    , ("selectedRowId", E.int slice.selectedRowId)
    , ("selectedColId", E.int slice.selectedColId)
    , ("xdlim", E.list E.int slice.xDlim)
    , ("ydlim", E.list E.int slice.yDlim)
    , ("xlabel", E.list E.string slice.xLabelRaw)
    , ("ylabel", E.list E.string slice.yLabelRaw)
    , ("showNetBoundaries", E.bool True)
    , ("showOverlayTitles", E.bool slice.showNetworkLabels)
    ]


encodeMatrixValues : List (List (Maybe Float)) -> E.Value
encodeMatrixValues rows =
  E.list (E.list encodeMaybeFloat) rows


encodeMaybeHighLow : MaybeHighLowPair -> E.Value
encodeMaybeHighLow { low, high } =
  E.object
    [ ("low", encodeMaybeFloat low)
    , ("high", encodeMaybeFloat high)
    ]


encodeMaybeFloat : Maybe Float -> E.Value
encodeMaybeFloat mbVal =
  case mbVal of
    Just v -> E.float v
    Nothing -> E.null


matrixSliceFromBundle : RtData -> Maybe MatrixSlice
matrixSliceFromBundle rtData =
  rtData.matrixBundle
    |> Maybe.andThen
      (\bundle ->
        let
          baseRegion = bundle.region
          withToggle =
            { baseRegion | showNetworkLabels = True }
        in
        Just <| applyHemisphereToSlice rtData.matrixHemisphere withToggle)


applyHemisphereToSlice : Hemisphere -> MatrixSlice -> MatrixSlice
applyHemisphereToSlice hemi slice =
  if slice.axis /= "regions" || hemi == BothHemis then
    slice
  else
    let
      classify lbl shortLbl =
        let
          base =
            if String.isEmpty shortLbl then lbl else shortLbl

          tokens =
            base
              |> String.toLower
              |> String.map (\c -> if List.member c [ '_', '-', '(', ')', ',' ] then ' ' else c)
              |> String.words
        in
        if List.member "left" tokens || List.member "l" tokens || List.member "lh" tokens then
          LeftHemis
        else if List.member "right" tokens || List.member "r" tokens || List.member "rh" tokens then
          RightHemis
        else
          BothHemis

      keepLabel shortLbl lbl =
        case ( classify lbl shortLbl, hemi ) of
          (LeftHemis, LeftHemis) -> True
          (RightHemis, RightHemis) -> True
          (BothHemis, BothHemis) -> True
          (BothHemis, _) -> False
          _ -> False

      maskX =
        List.map2 keepLabel slice.xShortLabels slice.xLabels

      maskY =
        List.map2 keepLabel slice.yShortLabels slice.yLabels

      filterWith mask xs =
        List.map2 (\flag val -> if flag then Just val else Nothing) mask xs
          |> List.filterMap identity

      filterValues rows =
        rows
          |> List.indexedMap (\i row -> (getAt i maskY |> Maybe.withDefault False, row))
          |> List.filterMap
            (\(keepRow, row) ->
              if keepRow then
                Just <| filterWith maskX row
              else
                Nothing
            )

      newValues = filterValues slice.values
      newXLabels = filterWith maskX slice.xLabels
      newYLabels = filterWith maskY slice.yLabels
      newXShort = filterWith maskX slice.xShortLabels
      newYShort = filterWith maskY slice.yShortLabels
      newXIds = filterWith maskX slice.xIds
      newYIds = filterWith maskY slice.yIds
      newXCenters = filterWith maskX slice.xCenters
      newYCenters = filterWith maskY slice.yCenters
      newXNets = filterWith maskX slice.xNets
      newYNets = filterWith maskY slice.yNets
      newXNetsFull = filterWith maskX slice.xNetsFull
      newYNetsFull = filterWith maskY slice.yNetsFull

      countTruesBefore n mask =
        mask |> List.take n |> List.filter identity |> List.length

      remapBounds mask bounds =
        bounds
          |> List.map (\b -> countTruesBefore b mask)
          |> dedupConsecutive

      dedupConsecutive lst =
        lst
          |> List.foldl
            (\v acc ->
              case acc of
                [] -> [ v ]
                h :: _ ->
                  if h == v then acc else v :: acc
            )
            []
          |> List.reverse

      newBounds = remapBounds maskX slice.netBoundaries
      newBoundsY = remapBounds maskY slice.netBoundariesY
    in
    { slice
      | values = newValues
      , xLabels = newXLabels
      , yLabels = newYLabels
      , xShortLabels = newXShort
      , yShortLabels = newYShort
      , xIds = newXIds
      , yIds = newYIds
      , xCenters = newXCenters
      , yCenters = newYCenters
      , netBoundaries = newBounds
      , netBoundariesY = newBoundsY
      , xNets = newXNets
      , yNets = newYNets
      , xNetsFull = newXNetsFull
      , yNetsFull = newYNetsFull
    }


applyBundleCmap : String -> MatrixBundle -> MatrixBundle
applyBundleCmap cmap bundle =
  let
    upd slice = { slice | cmap = cmap }
  in
  { bundle | region = upd bundle.region }


mergeRanges : MaybeHighLowPair -> MaybeHighLowPair -> MaybeHighLowPair
mergeRanges existing incoming =
  let
    minMaybe a b =
      case (a, b) of
        (Just x, Just y) -> Just (Basics.min x y)
        (Just x, Nothing) -> Just x
        (Nothing, Just y) -> Just y
        _ -> Nothing

    maxMaybe a b =
      case (a, b) of
        (Just x, Just y) -> Just (Basics.max x y)
        (Just x, Nothing) -> Just x
        (Nothing, Just y) -> Just y
        _ -> Nothing
  in
  MaybeHighLowPair
    (minMaybe existing.low incoming.low)
    (maxMaybe existing.high incoming.high)

stringPairToMaybeRange : StringHighLowPair -> MaybeHighLowPair
stringPairToMaybeRange { low, high } =
  MaybeHighLowPair (String.toFloat low) (String.toFloat high)


maybeApplyFixedRangeToRight : MaybeHighLowPair -> RtData -> ( RtData, Bool )
maybeApplyFixedRangeToRight fixed rt =
  case ( fixed.low, fixed.high ) of
    ( Just l, Just h ) ->
      let
        newPair =
          StringHighLowPair (String.fromFloat l) (String.fromFloat h)

        changed =
          newPair /= rt.info_r.vrange || fixed /= rt.matrixFixedRange
      in
      ( { rt
          | matrixFixedRange = fixed
        }
      , changed
      )

    _ ->
      ( rt, False )


matrixBundleRange : MatrixBundle -> Maybe MaybeHighLowPair
matrixBundleRange bundle =
  let
    sliceRange slice =
      slice.values
        |> List.concat
        |> List.filterMap identity
        |> (\vals ->
              case vals of
                [] -> Nothing
                _ ->
                  let
                    minVal = List.minimum vals |> Maybe.withDefault 0
                    maxVal = List.maximum vals |> Maybe.withDefault 0
                  in
                  Just <| MaybeHighLowPair (Just minVal) (Just maxVal)
           )

    combineRange r1 r2 =
      case (r1, r2) of
        (Just a, Just b) -> Just <| mergeRanges a b
        (Just a, Nothing) -> Just a
        (Nothing, Just b) -> Just b
        _ -> Nothing

    regionR = sliceRange bundle.region
  in
  regionR


getMatrixCmap : RtData -> String
getMatrixCmap rtData =
  -- matrix is based on the right (connectivity) side by design
  rtData.info_r.cmap


toImgRequest : RtData -> GetImageData
toImgRequest rtData =
  GetImageData 
    rtData.currentAtlas
    rtData.currentImg
    rtData.idx4d
    rtData.info_l
    rtData.info_r


updateThresh : (StringHighLowPair -> StringHighLowPair) -> SideInfo -> SideInfo
updateThresh updateFn side = { side | threshold = updateFn side.threshold }

updateCmap : String -> SideInfo -> SideInfo
updateCmap val sideInfo = { sideInfo | cmap = val }

updateHLPairVal : HighOrLow -> String -> StringHighLowPair -> StringHighLowPair
updateHLPairVal idx val vrange = case idx of
  Low -> { vrange | low = val }
  High -> { vrange | high = val }
    
updateVRange : (StringHighLowPair -> StringHighLowPair) -> SideInfo -> SideInfo
updateVRange updateFn side = { side | vrange = updateFn side.vrange }

updateCoord : CoordIdx -> String -> StringCoords -> StringCoords
updateCoord idx newVal coords = case idx of
  X1 -> { coords | x1 = newVal }
  X2 -> { coords | x2 = newVal }
  X3 -> { coords | x3 = newVal }

updateCoords : (StringCoords -> StringCoords) -> SideInfo -> SideInfo
updateCoords updateFn sideInfo = { sideInfo | coords = updateFn sideInfo.coords }

updateActiveSide : (SideInfo -> SideInfo) -> RtData -> RtData
updateActiveSide updFn data = case data.activeSide of
  Left -> { data | info_l = updFn data.info_l }
  Right -> { data | info_r = updFn data.info_r }

updateWaitingForFirstImage : InitData -> Key -> Url.Url -> Event -> Maybe SharedInfos -> ( Model, Cmd Event )
updateWaitingForFirstImage initData key url ev mbSharedInfos =
    case ev of
      RecvFS msg -> case decodeServerMsg msg of
        Ok (MFSImg img lLabel rLabel matrixBundle value_l value_r color_l color_r vrange_l vrange_r) -> 
          let 
            (atlas, images) = DNE.head initData.atlas_image_map
            fixedRange = matrixBundle |> Maybe.andThen matrixBundleRange |> Maybe.withDefault (MaybeHighLowPair Nothing Nothing)
            baseData =
              case mbSharedInfos of
                Nothing ->
                  RtData 
                    initData 
                    img 
                    defaultSideInfoLeft
                    defaultSideInfoRight 
                    0 
                    Left 
                    atlas
                    (LNE.head images)
                    False
                    key
                    url
                    False
                    matrixBundle
                    fixedRange
                    True
                    Nothing
                    BothHemis
                    False
                Just si ->
                  RtData
                    initData 
                    img 
                    (SideInfo (StringCoords si.lx1 si.lx2 si.lx3) (StringHighLowPair si.llow si.lhigh) (StringHighLowPair si.lthreshl si.lthreshh) True lLabel Nothing Nothing si.lcmap)
                    (SideInfo (StringCoords si.rx1 si.rx2 si.rx3) (StringHighLowPair si.rlow si.rhigh) (StringHighLowPair si.rthreshl si.rthreshh) True rLabel Nothing Nothing si.rcmap)
                    si.idx4d
                    Left 
                    atlas
                    (LNE.head images)
                    False
                    key
                    url
                    False
                    matrixBundle
                    fixedRange
                    True
                    Nothing
                    BothHemis
                    False
            overlayed =
              { baseData
                | info_l = baseData.info_l |> setOverlayInfo lLabel value_l color_l |> setRangeFromServer vrange_l
                , info_r = baseData.info_r |> setOverlayInfo rLabel value_r color_r |> setRangeFromServer vrange_r
              }
            (rtData, rangeChanged) = maybeApplyFixedRangeToRight fixedRange overlayed
            cmds =
              Cmd.batch
                [ matrixPortCmd rtData
                , if rangeChanged then requestNewImage rtData else Cmd.none
                ]
          in
          ( Running rtData, cmds )
        Ok MFSUnknown -> (WaitingForFirstImage initData key url mbSharedInfos, Cmd.none)
        Ok mfs -> unexpectedMFS (WaitingForFirstImage initData key url mbSharedInfos) mfs
        Err e -> errorStateFromDecoding e msg
      _ -> unexpectedEv (WaitingForFirstImage initData key url mbSharedInfos) ev


updateWaitingForInitData : Event -> Key -> Url.Url -> Maybe SharedInfos -> ( Model, Cmd Event )
updateWaitingForInitData ev key url mbSharedInfos =
    case ev of
      RecvFS msg -> case decodeServerMsg msg of
          Ok (MFSInitData initData) ->
            getImageReqFromInitData initData mbSharedInfos 
              |> encodeMsgToServer |> sendMessage |> Ok
              |> \res -> case res of
                Ok cmd -> (WaitingForFirstImage initData key url mbSharedInfos, cmd)
                Err e -> (Error <| "While processing received init Data\n" ++ e, Cmd.none)
          Ok MFSUnknown ->
            (WaitingForInitData key url mbSharedInfos, Cmd.none)
          Ok mfs -> unexpectedMFS (WaitingForInitData key url mbSharedInfos) mfs
          Err e -> errorStateFromDecoding e msg
      _ -> unexpectedEv (WaitingForInitData key url mbSharedInfos) ev


errorStateFromDecoding : D.Error -> String -> ( Model, Cmd Event )
errorStateFromDecoding decodeErr msg=
    let 
      res = Error <| "Couldn't decode this message:\n"
        ++ msg
        ++ "This was the error:\n"
        ++ D.errorToString decodeErr
    in
    (res, Cmd.none)


unexpectedEv : Model -> Event -> ( Model, Cmd Event )
unexpectedEv currModel _ =
    ( Error "Unexpected event in current state", Cmd.none )


unexpectedMFS : Model -> MsgFromServer -> ( Model, Cmd Event )
unexpectedMFS currModel _ =
    ( Error "Unexpected server message in current state", Cmd.none )

getImageReqFromInitData : InitData -> Maybe SharedInfos -> MsgToServer
getImageReqFromInitData initData mbSharedData =
  case mbSharedData of
    Nothing -> 
      let
        (aName, images) = DNE.head initData.atlas_image_map
        iName = LNE.head images
      in
      MTSGetImg <| GetImageData aName iName 0 defaultSideInfoLeft defaultSideInfoRight
    Just d ->
      MTSGetImg <| GetImageData 
        d.atlas 
        d.img
        d.idx4d
                    (SideInfo 
          (StringCoords d.lx1 d.lx2 (d.lx3)) 
          (StringHighLowPair d.llow d.lhigh) 
          (StringHighLowPair d.lthreshl d.lthreshh)
          True
          Nothing
          Nothing
          Nothing
          d.lcmap)
        (SideInfo 
          (StringCoords d.rx1 d.rx2 d.rx3) 
          (StringHighLowPair d.rlow d.rhigh) 
          (StringHighLowPair d.rthreshl d.rthreshh)
          True
          Nothing
          Nothing
          Nothing
          d.rcmap)


defaultSideInfoLeft : SideInfo
defaultSideInfoLeft = SideInfo (StringCoords "0" "0" "0") (StringHighLowPair "-" "-") (StringHighLowPair "-" "-") True Nothing Nothing Nothing "tab20"

defaultSideInfoRight : SideInfo
defaultSideInfoRight = SideInfo (StringCoords "0" "0" "0") (StringHighLowPair "-" "-") (StringHighLowPair "-" "-") True Nothing Nothing Nothing "coolwarm"
    
defaultRtData : InitData -> Key -> Url.Url -> MatrixBundle -> RtData
defaultRtData initData key url matrixBundle =
  let
    (atlas, images) = DNE.head initData.atlas_image_map
  in
  RtData
    initData
    ""
    defaultSideInfoLeft
    defaultSideInfoRight
    0
    Left
    atlas
    (LNE.head images)
    False
    key
    url
    False
    (Just matrixBundle)
    (MaybeHighLowPair Nothing Nothing)
    True
    Nothing
    BothHemis
    False
    

encodeMsgToServer : MsgToServer -> String
encodeMsgToServer = msgToServerToValue >> E.encode 0


msgToServerToValue : MsgToServer -> E.Value
msgToServerToValue msg =
    case msg of
      MTSGetInitData -> mkArglessJsonMsg "GetInitData"
      MTSGetImg req -> encodeGetImgReq req
      MTSGetImgWithClick reqData pos ctrlIsHeld-> encodeGetImgReqWithPos reqData pos ctrlIsHeld
                        

encodeGetImgReq : GetImageData -> E.Value
encodeGetImgReq req = E.object <| ("mtype", E.string "GetImg") :: reqDefaultFields req


reqDefaultFields : GetImageData -> List ( String, E.Value )
reqDefaultFields req = 
  [ ("atlas_name", E.string req.atlasName)
  , ("img_name", E.string req.imgName)
  , ("idx_4d", E.int req.idx4d)
  , ("infos_l", encodeSideInfo req.infosL)
  , ("infos_r", encodeSideInfo req.infosR)
  ]


encodeGetImgReqWithPos : GetImageData -> Pos -> Bool -> E.Value
encodeGetImgReqWithPos req pos ctrlIsHeld =
    E.object 
      <| ("mtype", E.string "GetImgWithPos") 
      :: ("pos", encodePos pos) 
      :: ("ctrl", E.bool ctrlIsHeld)
      :: reqDefaultFields req


encodePos : Pos -> E.Value
encodePos (x, y) = E.object [("x", E.float x), ("y", E.float y)]


encodeSideInfo : SideInfo -> E.Value
encodeSideInfo info =
    E.object
      [ ("coords", E.list E.int <| coordsToList <| parseCoords info.coords)
      , ("vrange", encodeHLPair <| parseStringHLPair info.vrange)
      , ("threshold", encodeHLPair <| parseStringHLPair info.threshold)
      , ("smoothed", E.bool info.smoothed)
      , ("cmap", E.string info.cmap)
      ]


encodeHLPair : MaybeHighLowPair -> E.Value
encodeHLPair {low, high} = 
  let 
    encodeVal x = case x of
      Just v -> E.float v
      Nothing -> E.null
  in
  E.list identity [encodeVal low, encodeVal high]
    

coordsToList : MaybeCoords -> List Int
coordsToList { x1, x2, x3 } = List.map (Maybe.withDefault 0) [x1, x2, x3]
    
mkArglessJsonMsg : String -> E.Value
mkArglessJsonMsg mtype = E.object [ ("mtype", E.string mtype )]

subscriptions : Model -> Sub Event
subscriptions _ =
  Sub.batch
    [ messageReceiver RecvFS
    , matrixClicked (\p -> EvMatrixClicked p.row p.col)
    ]

decodeServerMsg : String -> Result D.Error MsgFromServer
decodeServerMsg msg = 
  let 
    decoder =  D.field "mtype" D.string |> D.andThen (\t -> 
      case t of
        "Img" ->
          D.succeed MFSImg
            |> andMap (D.field "val" D.string)
            |> andMap (D.field "label_l" <| D.maybe regionLabelDecoder)
            |> andMap (D.field "label_r" <| D.maybe regionLabelDecoder)
            |> andMap (D.maybe <| D.field "matrix" matrixBundleDecoder)
            |> andMap (D.field "value_l" <| D.maybe D.float)
            |> andMap (D.field "value_r" <| D.maybe D.float)
            |> andMap (D.field "color_l" <| D.maybe D.string)
            |> andMap (D.field "color_r" <| D.maybe D.string)
            |> andMap (D.maybe <| D.field "vrange_l" rangeDecoder)
            |> andMap (D.maybe <| D.field "vrange_r" rangeDecoder)
        "ImgWithCoord" ->
          D.succeed MFSImgWithPos
            |> andMap (D.field "val" D.string)
            |> andMap (D.field "label_l" <| D.maybe regionLabelDecoder)
            |> andMap (D.field "label_r" <| D.maybe regionLabelDecoder)
            |> andMap (D.field "coords_l" maybeCoordDecoder)
            |> andMap (D.field "coords_r" maybeCoordDecoder)
            |> andMap (D.field "idx_4d" D.int)
            |> andMap (D.maybe <| D.field "matrix" matrixBundleDecoder)
            |> andMap (D.field "value_l" <| D.maybe D.float)
            |> andMap (D.field "value_r" <| D.maybe D.float)
            |> andMap (D.field "color_l" <| D.maybe D.string)
            |> andMap (D.field "color_r" <| D.maybe D.string)
            |> andMap (D.maybe <| D.field "vrange_l" rangeDecoder)
            |> andMap (D.maybe <| D.field "vrange_r" rangeDecoder)
        "InitData" -> D.map MFSInitData initDataDecoder
        "DeathRattle" -> D.succeed MFSDeathRattle
        "UnknownMsg" -> D.succeed MFSUnknown
        _ -> D.fail "can't decode Message from Server")
  in
  D.decodeString decoder msg


regionLabelDecoder : D.Decoder RegionLabel
regionLabelDecoder =
    D.list D.string |> D.andThen (\l ->
      case l of
        [vol, name] -> D.succeed <| RegionLabel vol name
        _ -> D.fail "Can't build a RegionLabel from this"
    )


maybeCoordDecoder : D.Decoder MaybeCoords
maybeCoordDecoder =
    D.list D.int |> D.andThen (
      \l -> case l of 
        [x1, x2, x3] -> D.succeed <| MaybeCoords (Just x1) (Just x2) (Just x3)
        _ -> D.fail "cant decode value as MaybeCoords"
    )

rangeDecoder : D.Decoder MaybeHighLowPair
rangeDecoder =
    D.list (D.nullable D.float)
        |> D.andThen
            (\l ->
                case l of
                    [ low, high ] ->
                        D.succeed (MaybeHighLowPair low high)

                    _ ->
                        D.fail "Expected range [low, high]"
            )


matrixDecoder : D.Decoder MatrixSlice
matrixDecoder =
  D.succeed MatrixSlice
    |> andMap (D.field "axis" D.string)
    |> andMap (D.field "index" D.int)
    |> andMap (D.field "values" <| D.list <| D.list <| D.nullable D.float)
    |> andMap (D.oneOf [ D.field "raw_values" <| D.list <| D.list <| D.nullable D.float, D.succeed [] ])
    |> andMap (D.field "vrange" maybeHighLowDecoder)
    |> andMap (D.field "cmap" D.string)
    |> andMap (D.oneOf [ D.field "show_labels" D.bool, D.succeed True ])
    |> andMap (D.oneOf [ D.field "net_boundaries" <| D.list D.int, D.succeed [] ])
    |> andMap (D.oneOf [ D.field "net_boundaries_y" <| D.list D.int, D.succeed [] ])
    |> andMap (D.oneOf [ D.field "net_labels" <| D.list D.string, D.succeed [] ])
    |> andMap (D.oneOf [ D.field "net_labels_full" <| D.list D.string, D.succeed [] ])
    |> andMap (D.oneOf [ D.field "net_labels_y" <| D.list D.string, D.succeed [] ])
    |> andMap (D.oneOf [ D.field "net_labels_full_y" <| D.list D.string, D.succeed [] ])
    |> andMap (D.oneOf [ D.field "net_members" <| D.list <| D.list D.int, D.succeed [] ])
    |> andMap (D.oneOf [ D.field "net_member_indices" <| D.list <| D.list D.int, D.succeed [] ])
    |> andMap (D.oneOf [ D.field "show_region_labels" D.bool, D.succeed True ])
    |> andMap (D.oneOf [ D.field "show_network_labels" D.bool, D.succeed True ])
    |> andMap (D.field "x_labels" <| D.list D.string)
    |> andMap (D.field "y_labels" <| D.list D.string)
    |> andMap (D.field "x_short_labels" <| D.list D.string)
    |> andMap (D.field "y_short_labels" <| D.list D.string)
    |> andMap (D.field "x_ids" <| D.list D.int)
    |> andMap (D.field "y_ids" <| D.list D.int)
    |> andMap (D.field "x_centers" <| D.list <| D.list D.float)
    |> andMap (D.field "y_centers" <| D.list <| D.list D.float)
    |> andMap (D.oneOf [ D.field "x_nets" <| D.list D.string, D.succeed [] ])
    |> andMap (D.oneOf [ D.field "y_nets" <| D.list D.string, D.succeed [] ])
    |> andMap (D.oneOf [ D.field "x_nets_full" <| D.list D.string, D.succeed [] ])
    |> andMap (D.oneOf [ D.field "y_nets_full" <| D.list D.string, D.succeed [] ])
    |> andMap (D.field "selected_row_id" D.int)
    |> andMap (D.field "selected_col_id" D.int)
    |> andMap (D.oneOf [ D.field "xdlim" <| D.list D.int, D.succeed [] ])
    |> andMap (D.oneOf [ D.field "ydlim" <| D.list D.int, D.succeed [] ])
    |> andMap (D.oneOf [ D.field "xlabel" <| D.list D.string, D.succeed [] ])
    |> andMap (D.oneOf [ D.field "ylabel" <| D.list D.string, D.succeed [] ])


matrixBundleDecoder : D.Decoder MatrixBundle
matrixBundleDecoder =
  D.oneOf
    [ D.map MatrixBundle
        (D.field "region" matrixDecoder)
    , matrixDecoder |> D.map MatrixBundle
    ]


maybeHighLowDecoder : D.Decoder MaybeHighLowPair
maybeHighLowDecoder =
  D.list (D.nullable D.float) |> D.andThen
    (\vals -> case vals of
      [low, high] -> D.succeed <| MaybeHighLowPair low high
      _ -> D.fail "expected [low, high] for vrange")


andMap : D.Decoder a -> D.Decoder (a -> b) -> D.Decoder b
andMap dec funDec =
  D.map2 (<|) funDec dec


initDataDecoder : D.Decoder InitData
initDataDecoder = 
  D.map4 InitData
    (D.field "atlas_image_map" <| decodeAtlasImageMap)
    (D.field "min_mni" coordDecoder)
    (D.field "max_mni" coordDecoder)
    (D.field "cmaps" <| D.list D.string)


coordDecoder : D.Decoder Coords
coordDecoder = 
  D.list D.int |> D.andThen (
    \l -> case l of
      [x1, x2, x3] -> D.succeed <| Coords x1 x2 x3
      _ -> D.fail "cant decode value as Coords"
    )


decodeAtlasImageMap : D.Decoder (DNE.NonemptyDict String (LNE.Nonempty String))
decodeAtlasImageMap =
  let 
    innerDictToNonEmpty = (\outer_dict -> 
      outer_dict
      |> Dict.map (\_ val -> LNE.fromList val)
      |> dictOfMaybesToMaybeOfDict
      |> (\mbData -> 
            case mbData of
              Just data -> D.succeed data
              Nothing -> D.fail "error decoding atlas-image-map"))
    outerDictToNonEmpty = (\outer_dict ->
      Dict.toList outer_dict
      |> (\elems -> 
            case elems of
              head :: tail -> D.succeed (DNE.fromList head tail) 
              _ -> D.fail "No atlas received"))
  in
  D.dict (D.list D.string) 
    |> D.andThen innerDictToNonEmpty 
    |> D.andThen outerDictToNonEmpty


dictOfMaybesToMaybeOfDict : Dict.Dict comparable (Maybe b) -> Maybe (Dict.Dict comparable b)
dictOfMaybesToMaybeOfDict dict =
  Dict.foldl 
    (\key mbVal mbRes ->
      case (mbVal, mbRes) of
        (Just val, Just res) -> Just (Dict.insert key val res)
        _ -> Nothing) 
      (Just Dict.empty) dict
    


renderPage : Model -> Browser.Document Event
renderPage model = 
  let 
    app = case model of
      Error desc -> renderInvalid desc
      WaitingForInitData _ _ _ -> renderUninitialized
      WaitingForFirstImage _ _ _ _ -> renderUninitialized
      Running data -> renderRunning data
    nav =
      case model of
        Running data -> topNav data
        _ -> text ""
    body = tudWrapper nav app
  in
  Browser.Document "TU Dresden - ConnExplorer" [body]


renderRunning : RtData -> Html Event
renderRunning rtData =
  div (fullwidth ++ css "background: rgba(255,255,255,1);max-height:100%; position: relative;") 
      [ loadingStyles
      , div (row "12px" ++ hcenter ++ css "align-items: flex-start; padding: 0 8px; margin-top: 12px;")
            [ renderMainView rtData ]
      , dialogView rtData
      , renderLoadingOverlay rtData.loading
      ]


loadingStyles : Html msg
loadingStyles =
  node "style" [] [ text """
@keyframes shimmerBar { 0% { transform: translateX(-60%); } 100% { transform: translateX(160%); } }
.cx-loader-overlay { position: fixed; inset: 0; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.82); backdrop-filter: blur(1px); z-index: 3000; }
.cx-loader-card { padding: 14px 18px; border-radius: 10px; background: white; border: 1px solid rgba(0,20,80,0.12); box-shadow: 0 10px 28px rgba(0,0,0,0.12); display: flex; align-items: center; gap: 12px; min-width: 200px; }
.cx-loader-text { font-weight: 700; color: #0f172a; letter-spacing: 0.2px; font-size: 15px; }
.cx-loader-bar { position: relative; width: 140px; height: 6px; border-radius: 999px; background: #e2e8f0; overflow: hidden; }
.cx-loader-bar::after { content: \"\"; position: absolute; inset: 0; background: linear-gradient(90deg, rgba(0,20,80,0) 0%, rgba(0,20,80,0.4) 50%, rgba(0,20,80,0) 100%); transform: translateX(-60%); animation: shimmerBar 1.2s ease-in-out infinite; }
""" ]


renderLoadingOverlay : Bool -> Html Event
renderLoadingOverlay isLoading =
  if not isLoading then
    text ""
  else
    div [ class "cx-loader-overlay" ]
      [ div [ class "cx-loader-card" ]
          [ div [ class "cx-loader-text" ] [ text "Loading..." ]
          , div [ class "cx-loader-bar" ] []
          ]
      ]


topNav : RtData -> Html Event
topNav rtData =
  let
    navBarStyle =
      css "display: grid; grid-template-columns: auto minmax(0,1fr) auto; align-items: center; gap: clamp(8px, 1vw, 12px); padding: 0 clamp(8px, 1vw, 12px); height: clamp(3.4em, 8vw, 3.8em); background: #00008c; color: #ffffff; position: sticky; top: 0; left: 0; right: 0; width: 100%; box-sizing: border-box; z-index: 1500; box-shadow: 0 2px 8px rgba(0,0,0,0.18);"

    brandStyle =
      css "display: inline-flex; align-items: center; gap: 10px; padding: 6px 10px; background: transparent; color: #ffffff;"

    navLinksStyle =
      css "display: inline-flex; align-items: center; gap: clamp(8px, 1.6vw, 16px); flex-wrap: wrap; justify-content: center; padding: 0 6px; color: #ffffff; font-weight: 800; text-transform: uppercase; letter-spacing: 0.35px; font-size: clamp(10px, 2vw, 12px); min-width: 0;"

    tabLink hrefTxt labelTxt =
      a
        ([ href hrefTxt, target "_blank" ]
          ++ css "color: #ffffff; text-decoration: none; font-weight: 800; letter-spacing: 0.45px; font-size: 12px; padding: 6px 4px; border-bottom: 2px solid transparent; transition: border-color 0.2s, color 0.2s;"
        )
        [ text labelTxt ]

    brand =
      div brandStyle
        [ img (src "/TUD_Logo_RGB_horizontal_weiß_de.svg" :: css "height: clamp(34px, 7vw, 48px); width: auto; display: block;") []
        , span (css "color: #ffffff; font-weight: 900; letter-spacing: 0.6px; text-transform: uppercase; font-size: clamp(13px, 2.4vw, 15px);") [ text "ConnExplorer" ]
        ]

    shareBtn =
      button
        ([ onClick EvShareButtonPressed ]
          ++ css "padding: 9px 14px; background: transparent; color: #ffffff; border: 1px solid rgba(255,255,255,0.7); border-radius: 12px; font-weight: 900; font-size: 11px; letter-spacing: 0.9px; text-transform: uppercase; cursor: pointer; transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease;"
        )
        [ text "Share" ]
  in
  div navBarStyle
    [ brand
    , div (css "display: flex; justify-content: center;")
        [ div navLinksStyle
            [ tabLink "/about.html" "About"
            , tabLink "https://tu-dresden.de/impressum" "Legal Notice"
            , tabLink "https://tu-dresden.de/impressum#ck_datenschutz" "Privacy"
            , tabLink "https://tu-dresden.de/transparenzgesetz" "Transparency Act"
            , tabLink ("/atlas-info.html?atlas=" ++ rtData.currentAtlas) "Atlas Info"
            , tabLink "https://tu-dresden.de/barrierefreiheit" "Accessibility"
            ]
        ]
    , div (css "display: flex; justify-content: flex-end; align-items: center;") [ shareBtn ]
    ]


dialogView : RtData -> Html Event
dialogView rtData = 
  if rtData.showShareDialog
  then div [] 
        [ div (css """
              position: absolute;
              left: 0%; top: 0%; width: 100vw; height: 100vh;
              background-color: #000;
              z-index: 1001;
              opacity: 0.4; """) 
          []
        , div (column "10px" ++ 
            css """
                background-color: #fff; 
                border-radius: 20px;
                padding: 20px;
                color: black;
                opacity: 1;
                
                position:absolute;
                top:50%;
                left:50%;
                transform:translate(-50%, -50%);
                z-index: 1002;
                """)
            [ text "Use the following link to share your current settings:"
            , input [readonly True, value <| getShareLink rtData] []
            , button (onClick EvCloseDialog :: css "float: right;") [text "Close me"]
            ]
        ]
  else text ""


getShareLink : RtData -> String
getShareLink rtData =
    let 
      url = rtData.url 
      l = rtData.info_l
      r = rtData.info_r
      path = UB.absolute
        [ "index.html"]
        [ UB.string "atlas" (rtData.currentAtlas)
        , UB.string "img" (rtData.currentImg )
        , UB.string "cmap_l" (rtData.info_l.cmap)
        , UB.string "cmap_r" (rtData.info_r.cmap)
        , UB.string "idx4d" (rtData.idx4d |> String.fromInt)
        , UB.string "lx1" l.coords.x1
        , UB.string "lx2" l.coords.x2
        , UB.string "lx3" l.coords.x3
        , UB.string "llow" l.vrange.low
        , UB.string "lhigh" l.vrange.high
        , UB.string "lthreshl" l.threshold.low
        , UB.string "lthreshh" l.threshold.high
        , UB.string "rx1" r.coords.x1
        , UB.string "rx2" r.coords.x2
        , UB.string "rx3" r.coords.x3
        , UB.string "rlow" r.vrange.low
        , UB.string "rhigh" r.vrange.high
        , UB.string "rthreshl" r.threshold.low
        , UB.string "rthreshh" r.threshold.high
        ]
    in 
    Url.toString {url | path = path, query = Nothing, fragment = Nothing}


withValKeyHandlerFor : InputId -> Attribute Event
withValKeyHandlerFor inputId =
        on "keyup" <| Keyboard.Event.considerKeyboardEvent <| toIncDec inputId

toIncDec : InputId -> KeyboardEvent -> Maybe Event
toIncDec inputId ev = 
  let
    mbDirection = if ev.keyCode == Keyboard.Key.Up then
                   Just 1
                  else if ev.keyCode == Keyboard.Key.Down then
                   Just -1
                  else
                   Nothing
    factor = if ev.shiftKey then 5 else 1
  in
  mbDirection |> Maybe.map (\x -> EvAdjustInput inputId (x * factor))


renderDataInfo : RtData -> Html Event
renderDataInfo rtData =
  div (column "5px" ++ css "margin: 1em;") 
    [ div (row "12px" ++ css "align-items: flex-start;")
        [ renderSideParams Left rtData.info_l rtData
        , renderSideParams Right rtData.info_r rtData
        ]
    ]


renderSideParams : Side -> SideInfo -> RtData -> Html Event
renderSideParams side si rtData =
  let
    onFocusSide = onFocus (EvSideSelect <| sideToString side)
  in
  div (column "6px" ++ css "flex:1; min-width: 220px;")
    [ renderVRange side si.vrange [ onFocusSide ]
    , renderThreshold side si.threshold [ onFocusSide ]
    ]


renderSideOverlay : Side -> SideInfo -> RtData -> Html Event
renderSideOverlay side si rtData =
  let
    regionLabel =
      case si.label of
        Just {vol, name} -> "Region: " ++ name ++ " (" ++ vol ++ ")"
        Nothing -> "Region: None"
    valueLabel =
      case si.value of
        Just v -> "Value: " ++ String.fromFloat v
        Nothing -> "Value: -"
    onFocusSide = onFocus (EvSideSelect <| sideToString side)
    baseSizing =
      "flex:1; min-width: 140px; max-width: 100%; font-size: clamp(7px, 0.78vw, 10.5px); line-height: 1.22;"
  in
  div (column "4px" ++ css baseSizing)
    [ p (css "font-size: clamp(9px, 1vw, 13px); color: #000; font-weight: 600; margin: 0;") [ text regionLabel ]
    , p (css "margin: 0; color: #1f2430; font-size: clamp(8px, 0.9vw, 10px); font-weight: 500;") [ text valueLabel ]
    , renderMniCoords si.coords rtData.invalidMniCoord rtData.initData.min_mni rtData.initData.max_mni side [ onFocusSide ]
    , renderVRange side si.vrange [ onFocusSide ]
    , renderThreshold side si.threshold [ onFocusSide ]
    , div (css "margin-top: 4px;") [ renderCmapSelect side si ]
    ]

maybeCoordsToStr : MaybeCoords -> String
maybeCoordsToStr mc =
  let
    { x1, x2, x3 } = mc
  in
  case (x1, x2, x3) of
    (Just a, Just b, Just c) ->
      "(" ++ String.fromInt a ++ ", " ++ String.fromInt b ++ ", " ++ String.fromInt c ++ ")"
    _ ->
      "( -, -, - )"


sideToString : Side -> String
sideToString s =
  case s of
    Left -> "Left"
    Right -> "Right"

hemisphereToString : Hemisphere -> String
hemisphereToString h =
  case h of
    BothHemis -> "both"
    LeftHemis -> "left"
    RightHemis -> "right"

hemisphereFromString : String -> Hemisphere
hemisphereFromString s =
  case String.toLower s of
    "left" -> LeftHemis
    "right" -> RightHemis
    _ -> BothHemis

renderShareButton :  Html Event
renderShareButton = button [onClick EvShareButtonPressed] [text "Share"]


renderHemisphereToggle : RtData -> Html Event
renderHemisphereToggle rtData =
  let
    opt label hemi =
      let
        isActive = rtData.matrixHemisphere == hemi
        baseStyle =
          "padding: 7px 12px; border-radius: 10px; border: 1px solid "
            ++ (if isActive then "#001450" else "#d4dae4")
            ++ "; background: "
            ++ (if isActive then "linear-gradient(135deg,#0f172a,#102a8a)" else "#f7f9fd")
            ++ "; color: "
            ++ (if isActive then "white" else "#0f172a")
            ++ "; cursor: pointer; font-size: 13px; min-width: 78px; text-align: center; transition: all 0.15s; box-shadow: "
            ++ (if isActive then "0 4px 12px rgba(0,0,0,0.15)" else "0 1px 2px rgba(0,0,0,0.05)")
      in
      button
        ([ onClick <| EvSetHemisphere <| hemisphereToString hemi ]
          ++ css baseStyle)
        [ text label ]
  in
  div (row "6px" ++ css "align-items: center; flex-wrap: wrap; gap: 8px; padding: 6px 10px; background: #eef2fb; border: 1px solid #d4dae4; border-radius: 12px;")
    [ span (css "font-weight: 500; font-size: 13px; color: #0f172a; letter-spacing: 0.2px;") [ text "Hemisphere:" ]
    , opt "Both" BothHemis
    , opt "Left" LeftHemis
    , opt "Right" RightHemis
    ]

renderCmapRow : RtData -> Html Event
renderCmapRow rtData =
  let
    leftOpts =
      renderCmapSelect Left rtData.info_l

    rightOpts =
      renderCmapSelect Right rtData.info_r
  in
  div (row "12px" ++ css "align-items: center; flex-wrap: wrap; padding: 6px 0; gap: 12px; justify-content: space-between;")
    [ div (row "6px" ++ css "align-items: center; gap: 6px; flex: 1; justify-content: flex-start;")
        [ text "Colour map", leftOpts ]
    , div (row "6px" ++ css "align-items: center; gap: 6px; flex: 1; justify-content: flex-end;")
        [ text "Colour map", rightOpts ]
    ]


renderCmapSelect : Side -> SideInfo -> Html Event
renderCmapSelect side si =
  let
    grouped = groupColorOptions allowedColorMaps
    handler =
      case side of
        Left -> EvUpdateCMapLeft
        Right -> EvUpdateCMapRight

    renderOption opt =
      let
        sample =
          Html.node "span"
            [ style "display" "inline-block"
            , style "width" "46px"
            , style "height" "12px"
            , style "margin-right" "10px"
            , style "border-radius" "4px"
            , style "border" "1px solid #c9d0dc"
            , style "vertical-align" "middle"
            , style "background-image" opt.gradient
            , style "background-size" "100% 100%"
            , style "background-repeat" "no-repeat"
            ]
            []
        isActive = String.toLower opt.name == String.toLower si.cmap
      in
      button
        [ onClick (handler opt.name)
        , attribute "type" "button"
        , style "width" "100%"
        , style "text-align" "left"
        , style "padding" "7px 10px"
        , style "border" (if isActive then "1px solid #001450" else "1px solid #d4dae4")
        , style "background" (if isActive then "#eef2f7" else "white")
        , style "border-radius" "6px"
        , style "cursor" "pointer"
        , style "color" "#111111"
        , style "font-size" "15px"
        ]
        [ sample, text opt.name ]

    renderGroup (label, opts) =
      div (column "6px")
        (p (css "margin: 0; font-size: 13px; color: #1c2734; font-weight: 700;") [ text label ]
          :: List.map renderOption opts)
    currentGrad = gradientFor si.cmap
  in
  details
    (css "min-width: 200px; max-width: 230px; border: 1px solid #d4dae4; border-radius: 8px; padding: 8px; background: white; position: relative;")
    [ Html.node "summary"
        [ style "list-style" "none"
        , style "cursor" "pointer"
        , style "outline" "none"
        , style "display" "flex"
        , style "align-items" "center"
        , style "justify-content" "space-between"
        , style "color" "#1c2734"
        ]
        [ span
            (css ("display: inline-flex; align-items: center; gap: 10px; font-size: 13px; color: #111111;"))
            [ Html.node "span"
                [ style "display" "inline-block"
                , style "width" "60px"
                , style "height" "12px"
                , style "border-radius" "4px"
                , style "border" "1px solid #c9d0dc"
                , style "background-image" currentGrad
                , style "background-size" "100% 100%"
                , style "background-repeat" "no-repeat"
                ]
                []
            , text si.cmap
            ]
        , span (css "font-size: 14px; color: #4b5563;") [ text "▼" ]
        ]
    , div (column "8px" ++ css "padding: 8px; position: absolute; top: calc(100% + 6px); left: 0; width: 100%; background: white; border: 1px solid #d4dae4; border-radius: 8px; box-shadow: 0 6px 18px rgba(0,0,0,0.12); max-height: 200px; overflow-y: auto; z-index: 10;")
        (List.map renderGroup grouped)
    ]

gradientFor : String -> String
gradientFor name =
  allowedColorMaps
    |> List.filter (\opt -> String.toLower opt.name == String.toLower name)
    |> List.head
    |> Maybe.map .gradient
    |> Maybe.withDefault "linear-gradient(90deg,#3b4cc0,#7aa0f2,#b5c6e5,#e5c6b5,#f2a07a,#c03b4c)"

groupColorOptions : List ColorOption -> List ( String, List ColorOption )
groupColorOptions opts =
  let
    step opt acc =
      case acc |> List.partition (\(c, _) -> c == opt.category) of
        ( (cat, lst) :: rest, others ) ->
          (cat, lst ++ [ opt ]) :: rest ++ others
        _ ->
          acc ++ [ ( opt.category, [ opt ] ) ]
  in
  List.foldl step [] opts


allowedColorMaps : List ColorOption
allowedColorMaps =
  let
    seq = "Sequential / Continuous"
    divg = "Diverging"
    qual = "Qualitative"
  in
  [ ColorOption "viridis" "linear-gradient(90deg,#440154,#3b528b,#21908c,#5dc863,#fde725)" seq
  , ColorOption "plasma" "linear-gradient(90deg,#0d0887,#7e03a8,#cb4679,#f0f921)" seq
  , ColorOption "inferno" "linear-gradient(90deg,#000004,#420a68,#932667,#dd513a,#fca50a,#fcffa4)" seq
  , ColorOption "magma" "linear-gradient(90deg,#000004,#3b0f70,#8c2981,#de4968,#fe9f6d,#fcfdbf)" seq
  , ColorOption "cividis" "linear-gradient(90deg,#00204c,#414487,#2a788e,#22a884,#7ad151,#fde725)" seq
  , ColorOption "RdBu" "linear-gradient(90deg,#b2182b,#ef8a62,#fddbc7,#d1e5f0,#67a9cf,#2166ac)" divg
  , ColorOption "RdYlBu" "linear-gradient(90deg,#a50026,#f46d43,#fdae61,#fee090,#e0f3f8,#abd9e9,#74add1,#4575b4)" divg
  , ColorOption "BrBG" "linear-gradient(90deg,#543005,#bf812d,#f6e8c3,#c7eae5,#35978f,#003c30)" divg
  , ColorOption "PuOr" "linear-gradient(90deg,#7f3b08,#b35806,#f1a340,#fee0b6,#d8daeb,#998ec3,#542788)" divg
  , ColorOption "Spectral" "linear-gradient(90deg,#9e0142,#f46d43,#fdae61,#fee08b,#e6f598,#abdda4,#66c2a5,#3288bd,#5e4fa2)" divg
  , ColorOption "coolwarm" "linear-gradient(90deg,#3b4cc0,#7aa0f2,#b5c6e5,#e5c6b5,#f2a07a,#c03b4c)" divg
  , ColorOption "Set1" "linear-gradient(90deg,#e41a1c,#377eb8,#4daf4a,#984ea3,#ff7f00,#ffff33,#a65628,#f781bf,#999999)" qual
  , ColorOption "tab20" "linear-gradient(90deg,#1f77b4,#aec7e8,#ff7f0e,#ffbb78,#2ca02c,#98df8a,#d62728,#ff9896,#9467bd,#c5b0d5,#8c564b,#c49c94,#e377c2,#f7b6d2,#7f7f7f,#c7c7c7,#bcbd22,#dbdb8d,#17becf,#9edae5)" qual
  , ColorOption "Set2" "linear-gradient(90deg,#66c2a5,#fc8d62,#8da0cb,#e78ac3,#a6d854,#ffd92f,#e5c494,#b3b3b3)" qual
  , ColorOption "Dark2" "linear-gradient(90deg,#1b9e77,#d95f02,#7570b3,#e7298a,#66a61e,#e6ab02,#a6761d,#666666)" qual
  ]
renderThreshold : Side -> StringHighLowPair -> List (Attribute Event) -> Html Event
renderThreshold side thresh extras =
    let
      compact = css "max-width: clamp(42px, 9vw, 72px); padding: 2px 4px; font-size: clamp(8px, 0.85vw, 11px); height: 18px;"
      labelTxt txt = span (css "font-weight: 700; color: #000; margin-right: 6px; font-size: clamp(8px, 0.95vw, 11px);") [ text txt ]
    in
    div (row "5px" ++ css "align-items: center; flex-wrap: nowrap; line-height: 1;")
      [ labelTxt "Threshold:"
      , input 
        ([ onInput <| EvUpdateThresh Low
        , onBlur EvRequestNewImage
        , onEnter EvRequestNewImage  
        , withValKeyHandlerFor (ThreshLow, side)
        , value thresh.low] ++ short ++ prettyInput ++ compact ++ extras) []
      , input 
        ([ onInput <| EvUpdateThresh High
        , onBlur EvRequestNewImage
        , onEnter EvRequestNewImage  
        , withValKeyHandlerFor (ThreshHigh, side)
        , value thresh.high] ++ short ++ prettyInput ++ compact ++ extras) []
      ]
    

renderVRange : Side -> StringHighLowPair -> List (Attribute Event) -> Html Event
renderVRange side vrange extras =
    let
      compact = css "max-width: clamp(50px, 12vw, 90px); padding: 3px 5px; font-size: clamp(9px, 1vw, 12px); height: 22px;"
      labelTxt txt = span (css "font-weight: 700; color: #000; margin-right: 6px; font-size: clamp(10px, 1.05vw, 13px);") [ text txt ]
    in
    div (row "6px" ++ css "flex-wrap: nowrap; align-items: center; line-height: 1;")
      [ labelTxt "Colour Range:"
      , input
        ( [ onInput <| EvUpdateVRange Low
          , onBlur EvRequestNewImage
          , onEnter EvRequestNewImage
          , withValKeyHandlerFor (Vlow, side)
          , value vrange.low
          ]
          ++ short ++ prettyInput ++ compact ++ extras
        ) []
      , input
        ( [ onInput <| EvUpdateVRange High
          , onBlur EvRequestNewImage
          , onEnter EvRequestNewImage
          , withValKeyHandlerFor (Vhigh, side)
          , value vrange.high
          ]
          ++ short ++ prettyInput ++ compact ++ extras
        ) []
      ]


renderMniCoords : StringCoords -> Bool -> Coords -> Coords -> Side -> List (Attribute Event) -> Html Event
renderMniCoords {x1, x2, x3} invalidCoord minMni maxMni side extraAttrs =
  let 
    compact = css "max-width: clamp(44px, 11vw, 80px); padding: 2px 4px; font-size: clamp(8px, 0.95vw, 11px); height: 18px;"
    labelTxt txt = span (css "font-weight: 700; color: #000; margin-right: 6px; line-height: 1; font-size: clamp(9px, 1vw, 12px);") [ text txt ]
    mni_fields = 
      div (row "5px" ++ css "align-items: center;")
        [ labelTxt "MNI:"
        , input 
          ([ onInput <| EvUpdateCoord X1
          , onBlur EvRequestNewImage
          , onEnter EvRequestNewImage
        , withValKeyHandlerFor (X1I, side)
        , x1 |> value] ++ parsibilityStyle x1 ++ short ++ prettyInput ++ compact)
          []
        , input 
          ([ onInput <| EvUpdateCoord X2
          , onBlur EvRequestNewImage
          , onEnter EvRequestNewImage
        , withValKeyHandlerFor (X2I, side)
        , x2 |> value] ++ parsibilityStyle x2 ++ short ++ prettyInput ++ compact)
          []
        , input 
          ([ onInput <| EvUpdateCoord X3
          , onBlur EvRequestNewImage
          , onEnter EvRequestNewImage
        , withValKeyHandlerFor (X3I, side)
        , x3 |> value] ++ parsibilityStyle x3 ++ short ++ prettyInput ++ compact) 
          []
        ]
  in
  if invalidCoord
  then
    div (column "5px")
      [ mni_fields
      , p 
          (css "color: red; font-size: 14px;") 
          [text <| "allowed values: " ++ coordsToStr minMni ++ " to " ++ coordsToStr maxMni]
      ]
  else 
    mni_fields


parsibilityStyle : String -> List (Attribute msg)
parsibilityStyle val =
    case String.toInt val of
      Just _ -> []
      Nothing -> redText

coordsToStr : Coords -> String
coordsToStr {x1, x2, x3} =  "(" 
  ++ String.fromInt x1 ++ ", "
  ++ String.fromInt x2 ++ ", "
  ++ String.fromInt x3 ++ ")"

renderButtonRow : Side -> Html Event
renderButtonRow side =
    let
      buttonId = \bLabel -> "side-button-" ++ sideToString bLabel
      buttonFn = (\bLabel -> 
        [ div (css "border: 2px solid black; padding: 5px;width: 100%;") 
              [ input 
                  ([ type_ "radio"
                    , id <| buttonId bLabel
                    , name "sideselect"
                    , value <| sideToString bLabel
                    , checked <| bLabel == side])
                  []
                , label ((for <| buttonId bLabel) :: paddingpx 5) [ text <| sideToString bLabel]
            ]
        ])
    in
    fieldset (onInput EvSideSelect :: css "border: none;width: 100%" ++ row "5px" ++ hcenter) <| buttonFn Left ++ buttonFn Right 


getActiveSideInfo : RtData -> SideInfo
getActiveSideInfo rtData =
    case rtData.activeSide of
      Left -> rtData.info_l
      Right -> rtData.info_r
    
renderMainView : RtData -> Html Event
renderMainView rtData = 
  div (column "12px" ++ css "width: 100%; max-width: none;") 
      [ div [ id "figure-shell" ]
      [ div [ id "figure-row" ]
          [ div [ id "brain-panel" ]
              [ div (css "display: flex; gap: 10px; flex-wrap: wrap; align-items: center; justify-content: flex-start;") 
                      [ select  ( onInput EvSelectedAtlas :: css "flex: 1 1 48%; min-width: 180px;" ++ prettySelect) 
                        <| List.map toSelectChild <| List.map (\(k, _) -> k) <| DNE.toList rtData.initData.atlas_image_map
                      , select ( onInput EvSelected4DImg :: css "flex: 1 1 48%; min-width: 180px;" ++ prettySelect) 
                        <|
                          let
                            imgs =
                              DNE.get rtData.currentAtlas rtData.initData.atlas_image_map
                                |> Maybe.map LNE.toList
                                |> Maybe.withDefault [ rtData.currentImg ]
                          in
                          List.map toSelectChild imgs
                      ]
                  , div (css "position: relative; width: 100%;")
                  [ img 
                    ([ src <| "data:image/png;base64," ++ rtData.img
                    , id "main-img"
                    , on "click" (D.map EvImageClick clickDecoder)
                    ]  ++ css "width: 100%; height: auto; max-height: 80vh; object-fit: contain; display: block; border: none; outline: none; background: transparent;") 
                    []
                      , let
                          overlayBase =
                            "position: absolute; top: 65%; transform: translateY(-50%); max-width: calc(50% - 8px); width: clamp(110px, 45vw, 220px); padding: clamp(3px, 1.2vw, 10px); background: rgba(255,255,255,0); border-radius: 10px; box-shadow: none; border: none; z-index: 2;"
                        in
                        div (css (overlayBase ++ "right: 50%; text-align: left;")) 
                          [ renderSideOverlay Left rtData.info_l rtData ]
                      , let
                          overlayBase =
                            "position: absolute; top: 65%; transform: translateY(-50%); max-width: calc(50% - 8px); width: clamp(110px, 45vw, 220px); padding: clamp(3px, 1.2vw, 10px); background: rgba(255,255,255,0); border-radius: 10px; box-shadow: none; border: none; z-index: 2;"
                        in
                        div (css (overlayBase ++ "right: clamp(4px, 3vw, 14px); text-align: left;")) 
                          [ renderSideOverlay Right rtData.info_r rtData ]
                  ]
              , div (row "10px" ++ css "align-items: flex-start; flex-wrap: wrap; padding-top: clamp(12px, 4vw, 28px); background: transparent;")
                      []
              ]
              , div ([ id "matrix-panel" ] ++ css "margin-left: clamp(10px, 3vw, 20px); margin-top: clamp(-14px, -3vw, 0px); background: transparent;")
                  [ renderMatrixHeader rtData
                  , renderMatrixView rtData
                  ]
              ]
          ]
      ]

renderMatrixView : RtData -> Html Event
renderMatrixView rtData =
  div (column "5px" ++ css "padding-top: 0.2em;") 
    [ div 
        (css "width: 100%; aspect-ratio: 1.05 / 1; min-height: 440px; max-height: 78vh; height: 70vh; border: none; border-radius: 0px; margin-top: 6px;" 
          ++ [ id "matrix-plot" ]) 
        []
    ]


renderMatrixHeader : RtData -> Html Event
renderMatrixHeader rtData =
  let
    matrixSlice = matrixSliceFromBundle rtData
    labelSwitch =
      let
        active = rtData.matrixLabelsOn
        trackColor = if active then "linear-gradient(135deg,#1e3a8a,#0f172a)" else "#e5e7eb"
        knobTransform = if active then "translateX(22px)" else "translateX(0px)"
      in
      label
        (css "display: inline-flex; align-items: center; gap: 8px; cursor: pointer; user-select: none;")
        [ span (css "font-size: 14px; color: #0f172a; font-weight: 700; letter-spacing: 0.2px;") [ text "Labels" ]
        , span
            (css ("position: relative; width: 46px; height: 24px; background: " ++ trackColor ++ "; border-radius: 999px; transition: all 0.15s; display: inline-block; box-shadow: inset 0 1px 2px rgba(0,0,0,0.12);"))
            [ span
                (css ("position: absolute; top: 3px; left: 3px; width: 18px; height: 18px; border-radius: 999px; background: #f8fafc; box-shadow: 0 1px 4px rgba(0,0,0,0.2); transform: " ++ knobTransform ++ "; transition: transform 0.15s;"))
                []
            ]
        , input
            ( [ type_ "checkbox"
              , checked active
              , onCheck EvToggleMatrixLabels
              ]
              ++ css "position: absolute; opacity: 0; width: 0; height: 0;"
            )
            []
        ]
    helperTxt =
      case matrixSlice of
        Nothing ->
          "Request an image to view the underlying matrix slice with zoom & pan."
        Just _ ->
          "Source/target (click to sync views)"
  in
  div (row "12px" ++ css "align-items: center; flex-wrap: wrap; gap: 10px; padding-bottom: 4px;")
    [ renderHemisphereToggle rtData
    , div (css "display: inline-flex; align-items: center; gap: 10px;")
        [ labelSwitch
        , p (css "margin: 0; font-size: 12px; color: #0f172a; font-weight: 600;") [ text helperTxt ]
        ]
    ]


renderInvalid : String -> Html Event
renderInvalid desc = 
    div (css "max-width: 60em; width: 60em;")
      ([ text "There was an error"
      , "Reason: " ++ desc |> text
      , text "Please reload the page to start over"
      ] |> List.map (\x -> p [] [x]))

renderUninitialized : Html Event
renderUninitialized =
  div []
    [ loadingStyles
    , renderLoadingOverlay True
    ]

onEnter : Event -> Attribute Event
onEnter msg =
    let
        isEnter code =
            if code == 13 then
                D.succeed msg
            else
                D.fail "not ENTER"
    in
        on "keydown" (D.andThen isEnter keyCode)


parseCoords : StringCoords -> MaybeCoords
parseCoords sc = MaybeCoords (String.toInt sc.x1) (String.toInt sc.x2) (String.toInt sc.x3)

parseStringHLPair : StringHighLowPair -> MaybeHighLowPair
parseStringHLPair vr = MaybeHighLowPair (String.toFloat vr.low) (String.toFloat vr.high)
