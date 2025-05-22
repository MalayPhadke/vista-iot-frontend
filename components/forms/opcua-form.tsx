"use client"

import React, { useState, useRef, useEffect } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Check, X, Plus, Trash, Download, Upload, ChevronDown, ChevronRight, Server, Cpu, Tag, UserCircle, FileDigit, BarChart, Cog } from "lucide-react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

// Define interfaces for IO Tags, Ports, and Devices
interface IOTag {
  id: string;
  name: string;
  dataType: string;
  address: string;
  description: string;
}

interface Device {
  id: string;
  name: string;
  type: string;
  enabled: boolean;
  unitNumber?: number;
  description?: string;
  tagWriteType?: string;
  addDeviceNameAsPrefix?: boolean;
  extensionProperties?: any;
  tags?: IOTag[];
}

interface Port {
  id: string;
  name: string;
  type: string;
  enabled: boolean;
  devices: Device[];
  description?: string;
}

// Define Engineering Units groups and units
interface EngineeringUnit {
  displayName: string;
  commonCode?: string;
  unitId?: string;
  conversion?: string;
  description?: string;
}

interface EngineeringUnitGroup {
  name: string;
  units: EngineeringUnit[];
}

export function OPCUAForm() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("general-setting")
  const [devices, setDevices] = useState<any[]>([])
  const [securityModeDialogOpen, setSecurityModeDialogOpen] = useState(false)
  const [currentSecurityPolicy, setCurrentSecurityPolicy] = useState<string>("") 
  const [securityModes, setSecurityModes] = useState({
    "basic128rsa15": "Sign, Sign and Encrypt",
    "basic256": "Sign, Sign and Encrypt",
    "basic256sha256": "Sign, Sign and Encrypt"
  })
  const [enabledPolicies, setEnabledPolicies] = useState({
    "none": true,
    "basic128rsa15": true,
    "basic256": true,
    "basic256sha256": true
  })
  
  // State for tag selection dialog
  const [tagSelectionDialogOpen, setTagSelectionDialogOpen] = useState(false)
  
  // State for engineering units dialog
  const [engineeringUnitsDialogOpen, setEngineeringUnitsDialogOpen] = useState(false)
  const [selectedDeviceForUnits, setSelectedDeviceForUnits] = useState<any>(null)
  const [selectedUnitGroup, setSelectedUnitGroup] = useState<string>("Miscellaneous")
  const [selectedUnit, setSelectedUnit] = useState<EngineeringUnit | null>(null)
  
  // State for add group dialog
  const [addGroupDialogOpen, setAddGroupDialogOpen] = useState(false)
  const [groupName, setGroupName] = useState("Group 1")
  const [groupNodeIdNamespace, setGroupNodeIdNamespace] = useState("1 - urn:ua.OpcUaServer:application")
  const [groupNodeIdType, setGroupNodeIdType] = useState("s - String")
  
  // Node ID namespace options
  const nodeIdNamespaceOptions = [
    "0 - OPC UA Namespace",
    "1 - urn:ua.OpcUaServer:application",
    "2 - Namespace URI 2",
    "3 - Namespace URI 3",
    "4 - Namespace URI 4",
    "5 - Namespace URI 5"
  ]
  
  // Node ID type options
  const nodeIdTypeOptions = [
    "s - String",
    "i - Numeric",
    "g - GUID",
    "b - Byte String"
  ]
  
  // IO tags tree structure state
  const [ioPorts, setIoPorts] = useState<Port[]>([])
  const [expandedPorts, setExpandedPorts] = useState<string[]>([])
  const [expandedDevices, setExpandedDevices] = useState<string[]>([])
  const [selectedTag, setSelectedTag] = useState<IOTag | null>(null)
  
  // Group expansion state
  const [expandedGroups, setExpandedGroups] = useState<string[]>([])
  
  // Engineering units groups
  const engineeringUnitGroups: EngineeringUnitGroup[] = [
    {
      name: "Rate/Speed",
      units: [
        { displayName: "radian per second", commonCode: "rad/s", unitId: "14401" },
        { displayName: "revolution per minute", commonCode: "r/min", unitId: "14402" },
        { displayName: "metre per second", commonCode: "m/s", unitId: "14403" },
        { displayName: "knot", commonCode: "kn", unitId: "14404" },
        { displayName: "kilometre per hour", commonCode: "km/h", unitId: "14405" },
        { displayName: "millimetre per second", commonCode: "mm/s", unitId: "14406" },
        { displayName: "centimetre per second", commonCode: "cm/s", unitId: "14407" },
        { displayName: "millimetre per minute", commonCode: "mm/min", unitId: "14408" },
        { displayName: "metre per minute", commonCode: "m/min", unitId: "14409" },
        { displayName: "metre per second pascal", commonCode: "(m/s)/Pa", unitId: "14410" },
        { displayName: "millimetre per year", commonCode: "mm/y", unitId: "14411" },
        { displayName: "foot per minute", commonCode: "ft/min", unitId: "14412" },
        { displayName: "inch per second", commonCode: "in/s", unitId: "14413" },
        { displayName: "foot per second", commonCode: "ft/s", unitId: "14414" },
        { displayName: "mile per hour (statute mile)", commonCode: "mile/h", unitId: "14415" },
        { displayName: "centimetre per second kelvin", commonCode: "(cm/s)/K", unitId: "14416" },
        { displayName: "centimetre per second bar", commonCode: "(cm/s)/bar", unitId: "14417" },
        { displayName: "foot per second degree Fahrenheit", commonCode: "(ft/s)/°F", unitId: "14418" },
        { displayName: "foot per second psi", commonCode: "(ft/s)/psi", unitId: "14419" },
        { displayName: "inch per second psi", commonCode: "(in/s)/psi", unitId: "14420" },
        { displayName: "metre per second kelvin", commonCode: "(m/s)/K", unitId: "14421" },
        { displayName: "metre per second bar", commonCode: "(m/s)/bar", unitId: "14422" },
        { displayName: "millilitre per square centimetre minute", commonCode: "(ml/min)/cm²", unitId: "14423" },
        { displayName: "mile per minute", commonCode: "mi/min", unitId: "14424" },
        { displayName: "inch per year", commonCode: "in/y", unitId: "14425" },
        { displayName: "kilometre per second", commonCode: "km/s", unitId: "14426" },
        { displayName: "inch per minute", commonCode: "in/min", unitId: "14427" },
        { displayName: "yard per second", commonCode: "yd/s", unitId: "14428" },
        { displayName: "yard per minute", commonCode: "yd/min", unitId: "14429" },
        { displayName: "yard per hour", commonCode: "yd/h", unitId: "14430" }
      ]
    },
    {
      name: "Rate/Acceleration",
      units: [
        { displayName: "metre per second squared", commonCode: "m/s²", unitId: "14501" },
        { displayName: "gal", commonCode: "Gal", unitId: "14502" },
        { displayName: "milligal", commonCode: "mGal", unitId: "14503" },
        { displayName: "kilometre per second squared", commonCode: "km/s²", unitId: "14504" },
        { displayName: "centimetre per second squared", commonCode: "cm/s²", unitId: "14505" },
        { displayName: "millimetre per second squared", commonCode: "mm/s²", unitId: "14506" },
        { displayName: "foot per second squared", commonCode: "ft/s²", unitId: "14507" },
        { displayName: "inch per second squared", commonCode: "in/s²", unitId: "14508" },
        { displayName: "standard acceleration of free fall", commonCode: "gn", unitId: "14509" },
        { displayName: "yard per second squared", commonCode: "yd/s²", unitId: "14510" },
        { displayName: "mile (statute mile) per second squared", commonCode: "mi/s²", unitId: "14511" },
        { displayName: "radian per second squared", commonCode: "rad/s²", unitId: "14512" },
        { displayName: "degree [unit of angle] per second squared", commonCode: "°/s²", unitId: "14513" }
      ]
    },
    {
      name: "Space and Time",
      units: [
        // Time units
        { displayName: "hour", commonCode: "h", unitId: "13101" },
        { displayName: "day", commonCode: "d", unitId: "13102" },
        { displayName: "kilosecond", commonCode: "ks", unitId: "13103" },
        { displayName: "millisecond", commonCode: "ms", unitId: "13104" },
        { displayName: "picosecond", commonCode: "ps", unitId: "13105" },
        { displayName: "microsecond", commonCode: "µs", unitId: "13106" },
        { displayName: "nanosecond", commonCode: "ns", unitId: "13107" },
        { displayName: "week", commonCode: "wk", unitId: "13108" },
        { displayName: "month", commonCode: "mo", unitId: "13109" },
        { displayName: "year", commonCode: "y", unitId: "13110" },
        { displayName: "tropical year", commonCode: "y (tropical)", unitId: "13111" },
        { displayName: "common year", commonCode: "y (365 days)", unitId: "13112" },
        { displayName: "sidereal year", commonCode: "y (sidereal)", unitId: "13113" },
        { displayName: "shake", commonCode: "shake", unitId: "13114" },
        { displayName: "minute [unit of time]", commonCode: "min", unitId: "13115" },
        { displayName: "second [unit of time]", commonCode: "s", unitId: "13116" },
        
        // Angle units
        { displayName: "radian", commonCode: "rad", unitId: "13117" },
        { displayName: "milliradian", commonCode: "mrad", unitId: "13118" },
        { displayName: "microradian", commonCode: "µrad", unitId: "13119" },
        { displayName: "degree [unit of angle]", commonCode: "°", unitId: "13120" },
        { displayName: "minute [unit of angle]", commonCode: "'", unitId: "13121" },
        { displayName: "second [unit of angle]", commonCode: "\"", unitId: "13122" },
        { displayName: "gon", commonCode: "g", unitId: "13123" },
        { displayName: "mil", commonCode: "mil", unitId: "13124" },
        { displayName: "revolution", commonCode: "rev", unitId: "13125" },
        { displayName: "steradian", commonCode: "sr", unitId: "13126" },
        { displayName: "inch per two pi radiant", commonCode: "in/revolution", unitId: "13127" },
        
        // Length units
        { displayName: "metre", commonCode: "m", unitId: "13128" },
        { displayName: "decimetre", commonCode: "dm", unitId: "13129" },
        { displayName: "centimetre", commonCode: "cm", unitId: "13130" },
        { displayName: "micrometre (micron)", commonCode: "µm", unitId: "13131" },
        { displayName: "millimetre", commonCode: "mm", unitId: "13132" },
        { displayName: "hectometre", commonCode: "hm", unitId: "13133" },
        { displayName: "kilometre", commonCode: "km", unitId: "13134" },
        { displayName: "nanometre", commonCode: "nm", unitId: "13135" },
        { displayName: "picometre", commonCode: "pm", unitId: "13136" },
        { displayName: "femtometre", commonCode: "fm", unitId: "13137" },
        { displayName: "decametre", commonCode: "dam", unitId: "13138" },
        { displayName: "nautical mile", commonCode: "n mile", unitId: "13139" },
        { displayName: "angstrom", commonCode: "Å", unitId: "13140" },
        { displayName: "astronomical unit", commonCode: "ua", unitId: "13141" },
        { displayName: "parsec", commonCode: "pc", unitId: "13142" },
        { displayName: "fathom", commonCode: "fth", unitId: "13143" },
        { displayName: "Gunter's chain", commonCode: "ch (UK)", unitId: "13144" },
        { displayName: "inch", commonCode: "in", unitId: "13145" },
        { displayName: "micro-inch", commonCode: "µin", unitId: "13146" },
        { displayName: "foot", commonCode: "ft", unitId: "13147" },
        { displayName: "yard", commonCode: "yd", unitId: "13148" },
        { displayName: "mile (statute mile)", commonCode: "mile", unitId: "13149" },
        { displayName: "mil-inch", commonCode: "mil", unitId: "13150" },
        { displayName: "light year", commonCode: "ly", unitId: "13151" },
        { displayName: "rod [unit of distance]", commonCode: "rd (US)", unitId: "13152" },
        { displayName: "megametre", commonCode: "Mm", unitId: "13153" },
        { displayName: "chain (based on U.S. survey foot)", commonCode: "ch (US survey)", unitId: "13154" },
        { displayName: "furlong", commonCode: "fur", unitId: "13155" },
        { displayName: "foot (U.S. survey)", commonCode: "ft (US survey)", unitId: "13156" },
        { displayName: "mile (based on U.S. survey foot)", commonCode: "mi (US survey)", unitId: "13157" },
        
        // Area units
        { displayName: "square metre", commonCode: "m²", unitId: "13158" },
        { displayName: "square kilometre", commonCode: "km²", unitId: "13159" },
        { displayName: "square micrometre (square micron)", commonCode: "µm²", unitId: "13160" },
        { displayName: "square metre per newton", commonCode: "m²/N", unitId: "13161" },
        { displayName: "decare", commonCode: "daa", unitId: "13162" },
        { displayName: "square centimetre", commonCode: "cm²", unitId: "13163" },
        { displayName: "square decimetre", commonCode: "dm²", unitId: "13164" },
        { displayName: "square hectometre", commonCode: "hm²", unitId: "13165" },
        { displayName: "square millimetre", commonCode: "mm²", unitId: "13166" },
        { displayName: "are", commonCode: "a", unitId: "13167" },
        { displayName: "hectare", commonCode: "ha", unitId: "13168" },
        { displayName: "square inch", commonCode: "in²", unitId: "13169" },
        { displayName: "square foot", commonCode: "ft²", unitId: "13170" },
        { displayName: "square yard", commonCode: "yd²", unitId: "13171" },
        { displayName: "square mile (statute mile)", commonCode: "mi²", unitId: "13172" },
        { displayName: "square mile (based on U.S. survey foot)", commonCode: "mi² (US survey)", unitId: "13173" },
        { displayName: "acre", commonCode: "acre", unitId: "13174" },
        { displayName: "circular mil", commonCode: "cmil", unitId: "13175" },
        
        // Volume units
        { displayName: "cubic metre", commonCode: "m³", unitId: "13176" },
        { displayName: "megalitre", commonCode: "Ml", unitId: "13177" },
        { displayName: "litre", commonCode: "l", unitId: "13178" },
        { displayName: "cubic millimetre", commonCode: "mm³", unitId: "13179" },
        { displayName: "cubic centimetre", commonCode: "cm³", unitId: "13180" },
        { displayName: "cubic decimetre", commonCode: "dm³", unitId: "13181" },
        { displayName: "millilitre", commonCode: "ml", unitId: "13182" },
        { displayName: "hectolitre", commonCode: "hl", unitId: "13183" },
        { displayName: "centilitre", commonCode: "cl", unitId: "13184" },
        { displayName: "cubic decametre", commonCode: "dam³", unitId: "13185" },
        { displayName: "cubic hectometre", commonCode: "hm³", unitId: "13186" },
        { displayName: "cubic kilometre", commonCode: "km³", unitId: "13187" },
        { displayName: "decilitre", commonCode: "dl", unitId: "13188" },
        { displayName: "microlitre", commonCode: "µl", unitId: "13189" },
        { displayName: "kilolitre", commonCode: "kl", unitId: "13190" },
        { displayName: "cubic inch", commonCode: "in³", unitId: "13191" },
        { displayName: "cubic foot", commonCode: "ft³", unitId: "13192" },
        { displayName: "cubic yard", commonCode: "yd³", unitId: "13193" },
        { displayName: "gallon (UK)", commonCode: "gal (UK)", unitId: "13194" },
        { displayName: "gallon (US)", commonCode: "gal (US)", unitId: "13195" },
        { displayName: "pint (US)", commonCode: "pt (US)", unitId: "13196" },
        { displayName: "pint (UK)", commonCode: "pt (UK)", unitId: "13197" },
        { displayName: "quart (UK)", commonCode: "qt (UK)", unitId: "13198" },
        { displayName: "liquid pint (US)", commonCode: "liq pt (US)", unitId: "13199" },
        { displayName: "liquid quart (US)", commonCode: "liq qt (US)", unitId: "13200" },
        { displayName: "dry pint (US)", commonCode: "dry pt (US)", unitId: "13201" },
        { displayName: "fluid ounce (UK)", commonCode: "fl oz (UK)", unitId: "13202" },
        { displayName: "quart (US)", commonCode: "qt (US)", unitId: "13203" },
        { displayName: "barrel (UK petroleum)", commonCode: "bbl (UK liq.)", unitId: "13204" },
        { displayName: "peck (UK)", commonCode: "pk (UK)", unitId: "13205" },
        { displayName: "pint (US dry)", commonCode: "pt (US dry)", unitId: "13206" },
        { displayName: "quart (US dry)", commonCode: "qt (US dry)", unitId: "13207" },
        { displayName: "ton (UK shipping)", commonCode: "British shipping ton", unitId: "13208" },
        { displayName: "ton (US shipping)", commonCode: "(US shipping ton)", unitId: "13209" },
        { displayName: "fluid ounce (US)", commonCode: "fl oz (US)", unitId: "13210" },
        { displayName: "bushel (UK)", commonCode: "bushel (UK)", unitId: "13211" },
        { displayName: "bushel (US)", commonCode: "bu (US)", unitId: "13212" },
        { displayName: "barrel (US)", commonCode: "barrel (US)", unitId: "13213" },
        { displayName: "dry barrel (US)", commonCode: "bbl (US)", unitId: "13214" },
        { displayName: "dry gallon (US)", commonCode: "dry gal (US)", unitId: "13215" },
        { displayName: "dry quart (US)", commonCode: "dry qt (US)", unitId: "13216" },
        { displayName: "stere", commonCode: "st", unitId: "13217" },
        { displayName: "cup [unit of volume]", commonCode: "cup (US)", unitId: "13218" },
        { displayName: "tablespoon (US)", commonCode: "tablespoon (US)", unitId: "13219" },
        { displayName: "teaspoon (US)", commonCode: "teaspoon (US)", unitId: "13220" },
        { displayName: "peck", commonCode: "pk (US)", unitId: "13221" },
        { displayName: "acre-foot (based on U.S. survey foot)", commonCode: "acre-ft (US survey)", unitId: "13222" },
        { displayName: "cord (128 ft³)", commonCode: "cord", unitId: "13223" },
        { displayName: "cubic mile (UK statute)", commonCode: "mi³", unitId: "13224" },
        { displayName: "ton, register", commonCode: "RT", unitId: "13225" }
      ]
    },
    {
      name: "Periodic and related phenomena",
      units: [
        { displayName: "hertz", commonCode: "Hz", unitId: "13201" },
        { displayName: "kilohertz", commonCode: "kHz", unitId: "13202" },
        { displayName: "megahertz", commonCode: "MHz", unitId: "13203" },
        { displayName: "gigahertz", commonCode: "GHz", unitId: "13204" },
        { displayName: "revolutions per minute", commonCode: "rpm", unitId: "13205" },
        { displayName: "revolutions per second", commonCode: "rps", unitId: "13206" },
        { displayName: "radian per second", commonCode: "rad/s", unitId: "13207" },
        { displayName: "degree per second", commonCode: "°/s", unitId: "13208" }
      ]
    },
    {
      name: "Mechanics",
      units: [
        { displayName: "metre", commonCode: "m", unitId: "13301" },
        { displayName: "kilogram", commonCode: "kg", unitId: "13302" },
        { displayName: "newton", commonCode: "N", unitId: "13303" },
        { displayName: "joule", commonCode: "J", unitId: "13304" },
        { displayName: "pascal", commonCode: "Pa", unitId: "13305" },
        { displayName: "watt", commonCode: "W", unitId: "13306" },
        { displayName: "kilogram per cubic metre", commonCode: "kg/m³", unitId: "13307" },
        { displayName: "metre per second", commonCode: "m/s", unitId: "13308" },
        { displayName: "metre per second squared", commonCode: "m/s²", unitId: "13309" },
        { displayName: "newton metre", commonCode: "N·m", unitId: "13310" },
        { displayName: "newton per square metre", commonCode: "N/m²", unitId: "13311" }
      ]
    },
    {
      name: "Heat",
      units: [
        { displayName: "kelvin", commonCode: "K", unitId: "13401" },
        { displayName: "degree celsius", commonCode: "°C", unitId: "13402" },
        { displayName: "degree fahrenheit", commonCode: "°F", unitId: "13403" },
        { displayName: "joule", commonCode: "J", unitId: "13404" },
        { displayName: "watt", commonCode: "W", unitId: "13405" },
        { displayName: "calorie", commonCode: "cal", unitId: "13406" },
        { displayName: "kilocalorie", commonCode: "kcal", unitId: "13407" },
        { displayName: "british thermal unit", commonCode: "BTU", unitId: "13408" },
        { displayName: "joule per kilogram kelvin", commonCode: "J/(kg·K)", unitId: "13409" },
        { displayName: "watt per metre kelvin", commonCode: "W/(m·K)", unitId: "13410" }
      ]
    },
    {
      name: "Electricity and Magnetism",
      units: [
        { displayName: "volt", commonCode: "V", unitId: "13501" },
        { displayName: "ampere", commonCode: "A", unitId: "13502" },
        { displayName: "ohm", commonCode: "Ω", unitId: "13503" },
        { displayName: "siemens", commonCode: "S", unitId: "13504" },
        { displayName: "farad", commonCode: "F", unitId: "13505" },
        { displayName: "coulomb", commonCode: "C", unitId: "13506" },
        { displayName: "weber", commonCode: "Wb", unitId: "13507" },
        { displayName: "tesla", commonCode: "T", unitId: "13508" },
        { displayName: "henry", commonCode: "H", unitId: "13509" },
        { displayName: "volt ampere", commonCode: "VA", unitId: "13510" },
        { displayName: "volt ampere reactive", commonCode: "var", unitId: "13511" }
      ]
    },
    {
      name: "Light and Related Electromagnetic Radiations",
      units: [
        { displayName: "lumen", commonCode: "lm", unitId: "13601" },
        { displayName: "lux", commonCode: "lx", unitId: "13602" },
        { displayName: "candela", commonCode: "cd", unitId: "13603" },
        { displayName: "watt per square metre", commonCode: "W/m²", unitId: "13604" },
        { displayName: "nanometre", commonCode: "nm", unitId: "13605" },
        { displayName: "angstrom", commonCode: "Å", unitId: "13606" },
        { displayName: "candela per square metre", commonCode: "cd/m²", unitId: "13607" }
      ]
    },
    {
      name: "Acoustics",
      units: [
        { displayName: "decibel", commonCode: "dB", unitId: "13701" },
        { displayName: "neper", commonCode: "Np", unitId: "13702" },
        { displayName: "bel", commonCode: "B", unitId: "13703" },
        { displayName: "pascal second", commonCode: "Pa·s", unitId: "13704" },
        { displayName: "decibel A-weighted", commonCode: "dBA", unitId: "13705" },
        { displayName: "phon", commonCode: "phon", unitId: "13706" },
        { displayName: "sone", commonCode: "sone", unitId: "13707" }
      ]
    },
    {
      name: "Physical Chemistry and Molecular Physics",
      units: [
        { displayName: "mole", commonCode: "mol", unitId: "13801" },
        { displayName: "mole per cubic metre", commonCode: "mol/m³", unitId: "13802" },
        { displayName: "joule per mole", commonCode: "J/mol", unitId: "13803" },
        { displayName: "joule per mole kelvin", commonCode: "J/(mol·K)", unitId: "13804" },
        { displayName: "coulomb per mole", commonCode: "C/mol", unitId: "13805" },
        { displayName: "pascal cubic metre per mole", commonCode: "Pa·m³/mol", unitId: "13806" },
        { displayName: "parts per million", commonCode: "ppm", unitId: "13807" },
        { displayName: "parts per billion", commonCode: "ppb", unitId: "13808" }
      ]
    },
    {
      name: "Atomic and Nuclear Physics",
      units: [
        { displayName: "electronvolt", commonCode: "eV", unitId: "13901" },
        { displayName: "kiloelectronvolt", commonCode: "keV", unitId: "13902" },
        { displayName: "megaelectronvolt", commonCode: "MeV", unitId: "13903" },
        { displayName: "atomic mass unit", commonCode: "u", unitId: "13904" },
        { displayName: "becquerel", commonCode: "Bq", unitId: "13905" },
        { displayName: "curie", commonCode: "Ci", unitId: "13906" },
        { displayName: "rutherford", commonCode: "rd", unitId: "13907" },
        { displayName: "barn", commonCode: "b", unitId: "13908" }
      ]
    },
    {
      name: "Nuclear Reactions and Ionizing Radiations",
      units: [
        { displayName: "gray", commonCode: "Gy", unitId: "14001" },
        { displayName: "sievert", commonCode: "Sv", unitId: "14002" },
        { displayName: "rad", commonCode: "rad", unitId: "14003" },
        { displayName: "rem", commonCode: "rem", unitId: "14004" },
        { displayName: "coulomb per kilogram", commonCode: "C/kg", unitId: "14005" },
        { displayName: "roentgen", commonCode: "R", unitId: "14006" },
        { displayName: "gray per second", commonCode: "Gy/s", unitId: "14007" },
        { displayName: "becquerel per cubic metre", commonCode: "Bq/m³", unitId: "14008" }
      ]
    },
    {
      name: "Characteristic Numbers (dimensionless parameters)",
      units: [
        { displayName: "percent", commonCode: "%", unitId: "14101" },
        { displayName: "ratio", commonCode: "ratio", unitId: "14102" },
        { displayName: "radian", commonCode: "rad", unitId: "14103" },
        { displayName: "steradian", commonCode: "sr", unitId: "14104" },
        { displayName: "degree", commonCode: "°", unitId: "14105" },
        { displayName: "count", commonCode: "count", unitId: "14106" },
        { displayName: "parts per unit", commonCode: "ppu", unitId: "14107" }
      ]
    },
    {
      name: "Solid State Physics",
      units: [
        { displayName: "reciprocal metre", commonCode: "m⁻¹", unitId: "14201" },
        { displayName: "square metre per volt second", commonCode: "m²/(V·s)", unitId: "14202" },
        { displayName: "cubic metre per mole", commonCode: "m³/mol", unitId: "14203" },
        { displayName: "ampere per square metre", commonCode: "A/m²", unitId: "14204" },
        { displayName: "siemens per metre", commonCode: "S/m", unitId: "14205" },
        { displayName: "farad per metre", commonCode: "F/m", unitId: "14206" },
        { displayName: "henry per metre", commonCode: "H/m", unitId: "14207" }
      ]
    },
    {
      name: "Miscellaneous",
      units: [
        { 
          displayName: "kilopascal square metre per gram", 
          commonCode: "kPa·m²/g", 
          unitId: "13107", 
          conversion: "10⁶·m²/s²",
          description: "kilopascal square metre per gram"
        },
        { displayName: "pascal per square metre", commonCode: "Pa/(kg·m²)", unitId: "14301" },
        { displayName: "kilopascal per millimetre", commonCode: "kPa/mm", unitId: "14302" },
        { displayName: "pascal per metre", commonCode: "Pa/m", unitId: "14303" },
        { displayName: "picospascal per kilometre", commonCode: "pPa/km", unitId: "14304" },
        { displayName: "millipascal per metre", commonCode: "mPa/m", unitId: "14305" },
        { displayName: "kilopascal per metre", commonCode: "kPa/m", unitId: "14306" },
        { displayName: "hectopascal per metre", commonCode: "hPa/m", unitId: "14307" },
        { displayName: "standard atmosphere per metre", commonCode: "atm/m", unitId: "14308" },
        { displayName: "technical atmosphere per metre", commonCode: "at/m", unitId: "14309" },
        { displayName: "torr per metre", commonCode: "Torr/m", unitId: "14310" },
        { displayName: "psi per inch", commonCode: "psi/in", unitId: "14311" },
        { displayName: "millilitre per square centimetre second", commonCode: "ml/(cm²·s)", unitId: "14312" },
        { displayName: "cubic foot per minute per square foot", commonCode: "ft³/(min·ft²)", unitId: "14313" },
        { displayName: "cubic metre per second per square metre", commonCode: "(m³/s)/m²", unitId: "14314" }
      ]
    }
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Settings saved",
      description: "OPC-UA settings have been updated.",
    })
  }

  const handleDiscard = () => {
    toast({
      title: "Changes discarded",
      description: "Your changes have been discarded.",
    })
  }

  const handleExport = () => {
    toast({
      title: "Export initiated",
      description: "Exporting configuration to file.",
    })
  }

  const handleImport = () => {
    toast({
      title: "Import initiated",
      description: "Importing configuration from file.",
    })
  }
  
  // Toggle expansion of a port in the tree
  const togglePortExpansion = (portId: string) => {
    setExpandedPorts(prev => 
      prev.includes(portId) ? prev.filter(id => id !== portId) : [...prev, portId]
    )
  }
  
  // Toggle expansion of a device in the tree
  const toggleDeviceExpansion = (deviceId: string) => {
    setExpandedDevices(prev => 
      prev.includes(deviceId) ? prev.filter(id => id !== deviceId) : [...prev, deviceId]
    )
  }
  
  // Toggle expansion of a group in the table
  const toggleGroupExpansion = (groupId: string) => {
    setExpandedGroups(prev => 
      prev.includes(groupId) ? prev.filter(id => id !== groupId) : [...prev, groupId]
    )
  }
  
  // Select a tag from the tree and add it to the OPC-UA configuration
  const selectTagFromTree = (tag: IOTag, deviceName: string, portName: string) => {
    // Get the namespace value from the state
    const namespaceValue = activeTab === "general-setting" ? "2" : "2"; // Default to 2 if not set
    
    // Check if we're adding a tag to a specific group
    const selectedGroupJson = localStorage.getItem('selectedGroupForTag');
    let selectedGroup = null;
    let groupName = "";
    
    if (selectedGroupJson) {
      try {
        selectedGroup = JSON.parse(selectedGroupJson);
        groupName = selectedGroup.name;
      } catch (e) {
        console.error('Error parsing selected group:', e);
      }
      // Clear the selected group from localStorage
      localStorage.removeItem('selectedGroupForTag');
    }
    
    // Format the node ID as ns=<namespace>;s=<group_name>:<device_name>:<tag_name> if adding to a group
    // or ns=<namespace>;s=<device_name>:<tag_name> if not
    const formattedNodeId = selectedGroup
      ? `ns=${namespaceValue};s=${groupName}:${deviceName}:${tag.name}`
      : `ns=${namespaceValue};s=${deviceName}:${tag.name}`;
    
    // Format the browse name and display name
    const formattedName = selectedGroup
      ? `${groupName}:${deviceName}:${tag.name}`
      : `${deviceName}:${tag.name}`;
    
    // Add the selected tag to the devices list
    const newTag = {
      id: `tag-${Date.now()}`,
      name: tag.name,
      nodeId: formattedNodeId,
      dataType: "Double", // Default data type
      engineeringUnits: "",
      browseName: formattedName,
      displayName: formattedName,
      description: tag.description || "",
      groupId: selectedGroup?.id || null // Store the group ID if adding to a group
    }
    
    setDevices(prev => [...prev, newTag])
    
    // Close the dialog
    setTagSelectionDialogOpen(false)
    
    // Show success message
    const successMessage = selectedGroup
      ? `Added tag ${tag.name} from ${deviceName} to group ${groupName}`
      : `Added tag ${tag.name} from ${deviceName} in ${portName}`;
      
    toast({
      title: "Tag Added",
      description: successMessage,
    })
  }
  
  // Fetch IO ports data from localStorage or API
  useEffect(() => {
    const fetchIoPorts = async () => {
      try {
        // For demonstration, check if data exists in localStorage
        const storedPorts = localStorage.getItem('io_ports_data')
        if (storedPorts) {
          setIoPorts(JSON.parse(storedPorts))
        }
        
        // Listen for changes to IO ports data
        const handleIoPortsUpdate = (event: StorageEvent) => {
          if (event.key === 'io_ports_data' && event.newValue) {
            try {
              const updatedPorts = JSON.parse(event.newValue)
              if (updatedPorts) {
                setIoPorts(updatedPorts)
              }
            } catch (error) {
              console.error('Error parsing updated IO ports data:', error)
            }
          }
        }
        
        window.addEventListener('storage', handleIoPortsUpdate)
        
        return () => {
          window.removeEventListener('storage', handleIoPortsUpdate)
        }
      } catch (error) {
        console.error('Error fetching IO ports data:', error)
      }
    }
    
    fetchIoPorts()
  }, [])

  return (
    <form onSubmit={handleSubmit}>
      {/* Top Bar with Global Actions */}
      <div className="flex justify-between items-center p-2 bg-gray-100 rounded-md mb-4">
        <div className="flex gap-2">
          <Button type="submit" variant="outline" className="flex items-center gap-1">
            <Check className="h-4 w-4 text-green-500" />
            Apply
          </Button>
          <Button type="button" variant="outline" className="flex items-center gap-1" onClick={handleDiscard}>
            <X className="h-4 w-4 text-red-500" />
            Discard
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="general-setting">General Setting</TabsTrigger>
              <TabsTrigger value="security-policy">Security Policy</TabsTrigger>
              <TabsTrigger value="discovery-server">Discovery Server</TabsTrigger>
            </TabsList>

            <TabsContent value="general-setting" className="space-y-6">
              <div className="flex items-center justify-between">
                <Label htmlFor="enable-opcua">Enable OPC UA Service</Label>
                <Switch id="enable-opcua" defaultChecked />
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="port" className="w-24">Port:</Label>
                    <Input id="port" defaultValue="51210" className="max-w-[200px]" />
                  </div>

                  <div className="flex items-center gap-2">
                    <Label htmlFor="user-account-control" className="w-24">User Account Control:</Label>
                    <Select defaultValue="anonymous">
                      <SelectTrigger id="user-account-control" className="w-[200px]">
                        <SelectValue placeholder="Select control" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="anonymous">Anonymous</SelectItem>
                        <SelectItem value="username">Username/Password</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center gap-2">
                    <Label htmlFor="user-name" className="w-24">User Name:</Label>
                    <Input id="user-name" className="max-w-[200px]" />
                  </div>

                  <div className="flex items-center gap-2">
                    <Label htmlFor="password" className="w-24">Password:</Label>
                    <Input id="password" type="password" className="max-w-[200px]" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="max-clients" className="w-24">Max Clients:</Label>
                    <Input id="max-clients" defaultValue="4" className="max-w-[200px]" />
                  </div>

                  <div className="flex items-center gap-2">
                    <Label htmlFor="node-id-namespace" className="w-24">Node ID Namespace:</Label>
                    <Select defaultValue="2">
                      <SelectTrigger id="node-id-namespace" className="w-[200px]">
                        <SelectValue placeholder="Select namespace" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">0 - OPC UA Namespace</SelectItem>
                        <SelectItem value="1">1 - urn:ua.OpcUaServer:application</SelectItem>
                        <SelectItem value="2">2 - Namespace URI 2</SelectItem>
                        <SelectItem value="3">3 - Namespace URI 3</SelectItem>
                        <SelectItem value="4">4 - Namespace URI 4</SelectItem>
                        <SelectItem value="5">5 - Namespace URI 5</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex justify-end mt-4">
                    <Button type="button" variant="outline" className="flex items-center gap-1">
                      OPC UA Config...
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="security-policy" className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Checkbox 
                    id="none" 
                    checked={enabledPolicies.none} 
                    onCheckedChange={(checked) => {
                      setEnabledPolicies(prev => ({ ...prev, none: !!checked }))
                    }}
                  />
                  <Label htmlFor="none">None</Label>
                </div>
                
                <div className="flex items-center gap-2">
                  <Checkbox 
                    id="basic128rsa15" 
                    checked={enabledPolicies.basic128rsa15}
                    onCheckedChange={(checked) => {
                      setEnabledPolicies(prev => ({ ...prev, basic128rsa15: !!checked }))
                    }}
                  />
                  <Label htmlFor="basic128rsa15">Basic128Rsa15</Label>
                  <Button 
                    variant="outline" 
                    className="w-[200px] ml-2 flex justify-between items-center" 
                    disabled={!enabledPolicies.basic128rsa15}
                    onClick={() => {
                      if (enabledPolicies.basic128rsa15) {
                        setCurrentSecurityPolicy("basic128rsa15")
                        setSecurityModeDialogOpen(true)
                      }
                    }}
                  >
                    {securityModes.basic128rsa15}
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </div>
                
                <div className="flex items-center gap-2">
                  <Checkbox 
                    id="basic256" 
                    checked={enabledPolicies.basic256}
                    onCheckedChange={(checked) => {
                      setEnabledPolicies(prev => ({ ...prev, basic256: !!checked }))
                    }}
                  />
                  <Label htmlFor="basic256">Basic256</Label>
                  <Button 
                    variant="outline" 
                    className="w-[200px] ml-2 flex justify-between items-center" 
                    disabled={!enabledPolicies.basic256}
                    onClick={() => {
                      if (enabledPolicies.basic256) {
                        setCurrentSecurityPolicy("basic256")
                        setSecurityModeDialogOpen(true)
                      }
                    }}
                  >
                    {securityModes.basic256}
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </div>
                
                <div className="flex items-center gap-2">
                  <Checkbox 
                    id="basic256sha256" 
                    checked={enabledPolicies.basic256sha256}
                    onCheckedChange={(checked) => {
                      setEnabledPolicies(prev => ({ ...prev, basic256sha256: !!checked }))
                    }}
                  />
                  <Label htmlFor="basic256sha256">Basic256Sha256</Label>
                  <Button 
                    variant="outline" 
                    className="w-[200px] ml-2 flex justify-between items-center" 
                    disabled={!enabledPolicies.basic256sha256}
                    onClick={() => {
                      if (enabledPolicies.basic256sha256) {
                        setCurrentSecurityPolicy("basic256sha256")
                        setSecurityModeDialogOpen(true)
                      }
                    }}
                  >
                    {securityModes.basic256sha256}
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </div>
              </div>
              
              <div className="mt-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="certificate-path">Certificate File Path:</Label>
                  <div className="flex gap-2">
                    <Select defaultValue="default-ca">
                      <SelectTrigger id="certificate-path" className="flex-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="select-ca">Select CA File</SelectItem>
                        <SelectItem value="default-ca">Default CA File</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button type="button" variant="outline">...</Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="private-key-path">Key File Path:</Label>
                  <div className="flex gap-2">
                    <Select defaultValue="default-key">
                      <SelectTrigger id="private-key-path" className="flex-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="select-key">Select Key File</SelectItem>
                        <SelectItem value="default-key">Default Key File</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button type="button" variant="outline">...</Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="discovery-server" className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Checkbox id="enable-local-discovery" />
                  <Label htmlFor="enable-local-discovery">Enable Local Discovery Server(LDS)</Label>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lds-server-url" className="mb-1">LDS Server URL:</Label>
                  <Input id="lds-server-url" defaultValue="opc.tcp://0.0.0.0:4840" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="registration-interval" className="mb-1">Registration Interval(s):</Label>
                  <Input id="registration-interval" defaultValue="300" className="max-w-[200px]" />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Device Table */}
      <div className="mt-6">
        <div className="flex items-center gap-2 mb-2">
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={() => setAddGroupDialogOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Add Group
          </Button>

          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={() => setTagSelectionDialogOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Add Tag
          </Button>

          <Button type="button" variant="outline" size="sm" className="flex items-center gap-1" onClick={handleExport}>
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button type="button" variant="outline" size="sm" className="flex items-center gap-1" onClick={handleImport}>
            <Upload className="h-4 w-4" />
            Import
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Name</TableHead>
              <TableHead className="w-[100px]">Node ID</TableHead>
              <TableHead className="w-[150px]">Data Type</TableHead>
              <TableHead className="w-[150px]">Engineering Units</TableHead>
              <TableHead className="w-[150px]">Browse Name</TableHead>
              <TableHead className="w-[150px]">Display Name</TableHead>
              <TableHead>Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {devices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  <div className="flex flex-col items-center justify-center">
                    <span className="text-muted-foreground">No devices configured</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              <>  
                {/* First render all groups, then render tags that don't belong to any group */}
                {devices
                  .filter(device => device.description === "Group")
                  .map((group) => {
                    // Find all tags that belong to this group
                    const groupTags = devices.filter(device => device.groupId === group.id);
                    const isExpanded = expandedGroups.includes(group.id);
                    
                    return (
                      <React.Fragment key={group.id}>
                        {/* Group Row */}
                        <TableRow className="group-row bg-muted/30 hover:bg-muted/50">
                          <TableCell 
                            className="cursor-pointer font-medium"
                            onClick={() => toggleGroupExpansion(group.id)}
                          >
                            <div className="flex items-center">
                              {isExpanded ? 
                                <ChevronDown className="h-4 w-4 mr-2" /> : 
                                <ChevronRight className="h-4 w-4 mr-2" />
                              }
                              <span className="font-semibold">{group.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>{group.nodeId}</TableCell>
                          <TableCell>
                            <Select 
                              value={group.dataType} 
                              onValueChange={(value) => {
                                setDevices(prev => 
                                  prev.map(d => d.id === group.id ? { ...d, dataType: value } : d)
                                )
                              }}
                            >
                              <SelectTrigger className="h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Boolean">Boolean</SelectItem>
                                <SelectItem value="Byte">Byte</SelectItem>
                                <SelectItem value="SByte">SByte</SelectItem>
                                <SelectItem value="UInt16">UInt16</SelectItem>
                                <SelectItem value="Int16">Int16</SelectItem>
                                <SelectItem value="UInt32">UInt32</SelectItem>
                                <SelectItem value="Int32">Int32</SelectItem>
                                <SelectItem value="Float">Float</SelectItem>
                                <SelectItem value="Double">Double</SelectItem>
                                <SelectItem value="StatusCode">StatusCode</SelectItem>
                                <SelectItem value="DateTime">DateTime</SelectItem>
                                <SelectItem value="String">String</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell 
                            className="cursor-pointer hover:bg-muted/50"
                            onClick={() => {
                              setSelectedDeviceForUnits(group);
                              setEngineeringUnitsDialogOpen(true);
                            }}
                          >
                            {group.engineeringUnits || "(Click to set)"}
                          </TableCell>
                          <TableCell>
                            <Input 
                              value={group.browseName} 
                              onChange={(e) => {
                                setDevices(prev => 
                                  prev.map(d => d.id === group.id ? { ...d, browseName: e.target.value } : d)
                                )
                              }}
                              className="h-8"
                            />
                          </TableCell>
                          <TableCell>
                            <Input 
                              value={group.displayName} 
                              onChange={(e) => {
                                setDevices(prev => 
                                  prev.map(d => d.id === group.id ? { ...d, displayName: e.target.value } : d)
                                )
                              }}
                              className="h-8"
                            />
                          </TableCell>
                          <TableCell className="flex items-center gap-2">
                            {group.description}
                            <div className="ml-auto flex items-center gap-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="flex items-center gap-1"
                                onClick={() => {
                                  setTagSelectionDialogOpen(true);
                                  // Store the group information to add the tag to this group when selected
                                  localStorage.setItem('selectedGroupForTag', JSON.stringify({
                                    id: group.id,
                                    name: group.name
                                  }));
                                }}
                              >
                                <Plus className="h-3 w-3" />
                                Add Tag
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="flex items-center gap-1 text-destructive hover:bg-destructive/10"
                                onClick={() => {
                                  // Delete the group and all its associated tags
                                  setDevices(prev => prev.filter(d => d.id !== group.id && d.groupId !== group.id));
                                  
                                  // Show success message
                                  toast({
                                    title: "Group Deleted",
                                    description: `Deleted group ${group.name} and all its tags`,
                                  });
                                }}
                              >
                                <Trash className="h-3 w-3" />
                                Delete
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                        
                        {/* Tag Rows */}
                        {isExpanded && groupTags.map((tag) => (
                          <TableRow key={tag.id} className="tag-row bg-muted/10 hover:bg-muted/20">
                            <TableCell className="pl-10">
                              <div className="flex items-center">
                                <Tag className="h-3 w-3 mr-2 text-muted-foreground" />
                                {tag.name}
                              </div>
                            </TableCell>
                            <TableCell>{tag.nodeId}</TableCell>
                            <TableCell>
                              <Select 
                                value={tag.dataType} 
                                onValueChange={(value) => {
                                  setDevices(prev => 
                                    prev.map(d => d.id === tag.id ? { ...d, dataType: value } : d)
                                  )
                                }}
                              >
                                <SelectTrigger className="h-8">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Boolean">Boolean</SelectItem>
                                  <SelectItem value="Byte">Byte</SelectItem>
                                  <SelectItem value="SByte">SByte</SelectItem>
                                  <SelectItem value="UInt16">UInt16</SelectItem>
                                  <SelectItem value="Int16">Int16</SelectItem>
                                  <SelectItem value="UInt32">UInt32</SelectItem>
                                  <SelectItem value="Int32">Int32</SelectItem>
                                  <SelectItem value="Float">Float</SelectItem>
                                  <SelectItem value="Double">Double</SelectItem>
                                  <SelectItem value="StatusCode">StatusCode</SelectItem>
                                  <SelectItem value="DateTime">DateTime</SelectItem>
                                  <SelectItem value="String">String</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell 
                              className="cursor-pointer hover:bg-muted/50"
                              onClick={() => {
                                setSelectedDeviceForUnits(tag);
                                setEngineeringUnitsDialogOpen(true);
                              }}
                            >
                              {tag.engineeringUnits || "(Click to set)"}
                            </TableCell>
                            <TableCell>
                              <Input 
                                value={tag.browseName} 
                                onChange={(e) => {
                                  setDevices(prev => 
                                    prev.map(d => d.id === tag.id ? { ...d, browseName: e.target.value } : d)
                                  )
                                }}
                                className="h-8"
                              />
                            </TableCell>
                            <TableCell>
                              <Input 
                                value={tag.displayName} 
                                onChange={(e) => {
                                  setDevices(prev => 
                                    prev.map(d => d.id === tag.id ? { ...d, displayName: e.target.value } : d)
                                  )
                                }}
                                className="h-8"
                              />
                            </TableCell>
                            <TableCell className="flex items-center gap-2">
                              <span className="text-sm">{tag.description}</span>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="ml-auto flex items-center gap-1 text-destructive hover:bg-destructive/10 h-7 px-2"
                                onClick={() => {
                                  // Delete the tag
                                  setDevices(prev => prev.filter(d => d.id !== tag.id));
                                  
                                  // Show success message
                                  toast({
                                    title: "Tag Deleted",
                                    description: `Deleted tag ${tag.name}`,
                                  });
                                }}
                              >
                                <Trash className="h-3 w-3" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </React.Fragment>
                    );
                  })}
                
                {/* Render tags that don't belong to any group */}
                {devices
                  .filter(device => device.description !== "Group" && !device.groupId)
                  .map((tag) => (
                    <TableRow key={tag.id}>
                      <TableCell>
                        {tag.name}
                      </TableCell>
                      <TableCell>{tag.nodeId}</TableCell>
                      <TableCell>
                        <Select 
                          value={tag.dataType} 
                          onValueChange={(value) => {
                            setDevices(prev => 
                              prev.map(d => d.id === tag.id ? { ...d, dataType: value } : d)
                            )
                          }}
                        >
                          <SelectTrigger className="h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Boolean">Boolean</SelectItem>
                            <SelectItem value="Byte">Byte</SelectItem>
                            <SelectItem value="SByte">SByte</SelectItem>
                            <SelectItem value="UInt16">UInt16</SelectItem>
                            <SelectItem value="Int16">Int16</SelectItem>
                            <SelectItem value="UInt32">UInt32</SelectItem>
                            <SelectItem value="Int32">Int32</SelectItem>
                            <SelectItem value="Float">Float</SelectItem>
                            <SelectItem value="Double">Double</SelectItem>
                            <SelectItem value="StatusCode">StatusCode</SelectItem>
                            <SelectItem value="DateTime">DateTime</SelectItem>
                            <SelectItem value="String">String</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell 
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => {
                          setSelectedDeviceForUnits(tag);
                          setEngineeringUnitsDialogOpen(true);
                        }}
                      >
                        {tag.engineeringUnits || "(Click to set)"}
                      </TableCell>
                      <TableCell>
                        <Input 
                          value={tag.browseName} 
                          onChange={(e) => {
                            setDevices(prev => 
                              prev.map(d => d.id === tag.id ? { ...d, browseName: e.target.value } : d)
                            )
                          }}
                          className="h-8"
                        />
                      </TableCell>
                      <TableCell>
                        <Input 
                          value={tag.displayName} 
                          onChange={(e) => {
                            setDevices(prev => 
                              prev.map(d => d.id === tag.id ? { ...d, displayName: e.target.value } : d)
                            )
                          }}
                          className="h-8"
                        />
                      </TableCell>
                      <TableCell className="flex items-center gap-2">
                        <span className="text-sm">{tag.description}</span>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="ml-auto flex items-center gap-1 text-destructive hover:bg-destructive/10 h-7 px-2"
                          onClick={() => {
                            // Delete the tag
                            setDevices(prev => prev.filter(d => d.id !== tag.id));
                            
                            // Show success message
                            toast({
                              title: "Tag Deleted",
                              description: `Deleted tag ${tag.name}`,
                            });
                          }}
                        >
                          <Trash className="h-3 w-3" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Security Mode Selection Dialog */}
      <Dialog open={securityModeDialogOpen} onOpenChange={setSecurityModeDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Security Mode Selection</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 py-4">
            <div className="flex items-center gap-2">
              <Checkbox id="sign-mode" defaultChecked />
              <Label htmlFor="sign-mode">Sign</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="sign-encrypt-mode" defaultChecked />
              <Label htmlFor="sign-encrypt-mode">Sign and Encrypt</Label>
            </div>
          </div>
          <DialogFooter className="flex justify-between sm:justify-between">
            <Button 
              type="button" 
              variant="secondary" 
              onClick={() => setSecurityModeDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              type="button" 
              onClick={() => {
                // In a real implementation, this would update the selected security modes
                setSecurityModeDialogOpen(false)
              }}
            >
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Tag Selection Dialog */}
      <Dialog open={tagSelectionDialogOpen} onOpenChange={setTagSelectionDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Select Tag</DialogTitle>
            <DialogDescription>
              {(() => {
                // Check if we're adding to a specific group
                const selectedGroupJson = localStorage.getItem('selectedGroupForTag');
                if (selectedGroupJson) {
                  try {
                    const selectedGroup = JSON.parse(selectedGroupJson);
                    return (
                      <div className="flex items-center gap-2">
                        <div className="flex items-center px-2 py-1 bg-muted rounded-md">
                          <ChevronRight className="h-3 w-3 mr-1 text-muted-foreground" />
                          <span className="font-medium">{selectedGroup.name}</span>
                        </div>
                        <span>Choose a tag to add to this group</span>
                      </div>
                    );
                  } catch (e) {
                    console.error('Error parsing selected group:', e);
                  }
                }
                return 'Choose a tag to add to your OPC-UA configuration';
              })()}
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex gap-2 h-[500px]">
            {/* Left side: Data Center Categories (1/4 width) */}
            <div className="w-1/4 border rounded-md overflow-auto">
              <div className="p-2 font-medium border-b">Data Center</div>
              <ScrollArea className="h-[450px]">
                <ul className="space-y-1 p-2">
                  {/* IO Tag Section */}
                  <li className="rounded hover:bg-muted">
                    <div 
                      className="flex items-center p-2 cursor-pointer"
                      onClick={() => togglePortExpansion('io-tag')}
                    >
                      {expandedPorts.includes('io-tag') ? 
                        <ChevronDown className="h-4 w-4 mr-1" /> : 
                        <ChevronRight className="h-4 w-4 mr-1" />
                      }
                      <Tag className="h-4 w-4 mr-2" />
                      <span className="text-sm">IO Tag</span>
                    </div>
                    
                    {/* Show ports if IO Tag is expanded */}
                    {expandedPorts.includes('io-tag') && (
                      <ul className="ml-6 space-y-1">
                        {ioPorts.map(port => (
                          <li key={port.id} className="rounded hover:bg-muted">
                            <div 
                              className="flex items-center p-2 cursor-pointer"
                              onClick={() => togglePortExpansion(port.id)}
                            >
                              {expandedPorts.includes(port.id) ? 
                                <ChevronDown className="h-4 w-4 mr-1" /> : 
                                <ChevronRight className="h-4 w-4 mr-1" />
                              }
                              <Server className="h-4 w-4 mr-2" />
                              <span className="text-sm">{port.name}</span>
                            </div>
                            
                            {/* Show devices if port is expanded */}
                            {expandedPorts.includes(port.id) && (
                              <ul className="ml-6 space-y-1">
                                {port.devices?.map(device => (
                                  <li key={device.id} className="rounded hover:bg-muted">
                                    <div 
                                      className="flex items-center p-2 cursor-pointer"
                                      onClick={() => toggleDeviceExpansion(device.id)}
                                    >
                                      {expandedDevices.includes(device.id) ? 
                                        <ChevronDown className="h-4 w-4 mr-1" /> : 
                                        <ChevronRight className="h-4 w-4 mr-1" />
                                      }
                                      <Cpu className="h-4 w-4 mr-2" />
                                      <span className="text-sm">{device.name}</span>
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                  
                  {/* Calculation Tag Section */}
                  <li className="rounded hover:bg-muted">
                    <div 
                      className="flex items-center p-2 cursor-pointer"
                      onClick={() => togglePortExpansion('calculation-tag')}
                    >
                      {expandedPorts.includes('calculation-tag') ? 
                        <ChevronDown className="h-4 w-4 mr-1" /> : 
                        <ChevronRight className="h-4 w-4 mr-1" />
                      }
                      <FileDigit className="h-4 w-4 mr-2" />
                      <span className="text-sm">Calculation Tag</span>
                    </div>
                  </li>
                  
                  {/* User Tag Section */}
                  <li className="rounded hover:bg-muted">
                    <div 
                      className="flex items-center p-2 cursor-pointer"
                      onClick={() => togglePortExpansion('user-tag')}
                    >
                      {expandedPorts.includes('user-tag') ? 
                        <ChevronDown className="h-4 w-4 mr-1" /> : 
                        <ChevronRight className="h-4 w-4 mr-1" />
                      }
                      <UserCircle className="h-4 w-4 mr-2" />
                      <span className="text-sm">User Tag</span>
                    </div>
                  </li>
                  
                  {/* System Tag Section */}
                  <li className="rounded hover:bg-muted">
                    <div 
                      className="flex items-center p-2 cursor-pointer"
                      onClick={() => togglePortExpansion('system-tag')}
                    >
                      {expandedPorts.includes('system-tag') ? 
                        <ChevronDown className="h-4 w-4 mr-1" /> : 
                        <ChevronRight className="h-4 w-4 mr-1" />
                      }
                      <Cog className="h-4 w-4 mr-2" />
                      <span className="text-sm">System Tag</span>
                    </div>
                  </li>
                  
                  {/* Stats Tag Section */}
                  <li className="rounded hover:bg-muted">
                    <div 
                      className="flex items-center p-2 cursor-pointer"
                      onClick={() => togglePortExpansion('stats-tag')}
                    >
                      {expandedPorts.includes('stats-tag') ? 
                        <ChevronDown className="h-4 w-4 mr-1" /> : 
                        <ChevronRight className="h-4 w-4 mr-1" />
                      }
                      <BarChart className="h-4 w-4 mr-2" />
                      <span className="text-sm">Stats Tag</span>
                    </div>
                  </li>
                </ul>
              </ScrollArea>
            </div>
            
            {/* Right side: Tag content (3/4 width) */}
            <div className="w-3/4 border rounded-md overflow-hidden">
              <ScrollArea className="h-[450px]">
                {/* Show IO Tag content if IO Tag section is selected and a port is expanded */}
                {expandedPorts.includes('io-tag') && expandedPorts.some(id => ioPorts.some(port => port.id === id)) && (
                  <div className="p-4">
                    {ioPorts
                      .filter(port => expandedPorts.includes(port.id))
                      .map(port => (
                        <div key={port.id} className="mb-4">
                          <h3 className="text-lg font-medium mb-2">{port.name}</h3>
                          {port.devices
                            .filter(device => expandedDevices.includes(device.id))
                            .map(device => (
                              <div key={device.id} className="mb-4 ml-4">
                                <h4 className="text-md font-medium mb-2">{device.name}</h4>
                                <div className="border rounded-md overflow-hidden">
                                  {device.tags && device.tags.length > 0 ? (
                                    <Table>
                                      <TableHeader>
                                        <TableRow>
                                          <TableHead>Name</TableHead>
                                          <TableHead>Data Type</TableHead>
                                          <TableHead>Address</TableHead>
                                          <TableHead>Description</TableHead>
                                          <TableHead>Action</TableHead>
                                        </TableRow>
                                      </TableHeader>
                                      <TableBody>
                                        {device.tags.map(tag => (
                                          <TableRow key={tag.id}>
                                            <TableCell>{tag.name}</TableCell>
                                            <TableCell>{tag.dataType}</TableCell>
                                            <TableCell>{tag.address}</TableCell>
                                            <TableCell>{tag.description}</TableCell>
                                            <TableCell>
                                              <Button 
                                                size="sm" 
                                                onClick={() => selectTagFromTree(tag, device.name, port.name)}
                                              >
                                                Select
                                              </Button>
                                            </TableCell>
                                          </TableRow>
                                        ))}
                                      </TableBody>
                                    </Table>
                                  ) : (
                                    <div className="text-center p-4 text-muted-foreground">
                                      No tags available for this device
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                        </div>
                      ))}
                  </div>
                )}
                
                {/* Show placeholder if no section is selected */}
                {!expandedPorts.some(id => ['io-tag', 'calculation-tag', 'user-tag', 'system-tag', 'stats-tag'].includes(id)) && (
                  <div className="flex flex-col items-center justify-center h-full p-8 text-muted-foreground">
                    <Server className="h-12 w-12 mb-4 text-muted-foreground/50" />
                    <p className="text-center">Select a tag category from the left panel to view available tags</p>
                  </div>
                )}
              </ScrollArea>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setTagSelectionDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Engineering Units Dialog */}
      <Dialog open={engineeringUnitsDialogOpen} onOpenChange={setEngineeringUnitsDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Edit OPC UA Units</DialogTitle>
          </DialogHeader>
          
          <div className="flex gap-4 h-[500px]">
            {/* Left side: Groups */}
            <div className="w-1/3 border rounded-md overflow-auto">
              <div className="p-2 font-medium border-b">Group:</div>
              <ScrollArea className="h-[450px]">
                <div className="p-2">
                  {engineeringUnitGroups.map((group) => (
                    <div 
                      key={group.name}
                      className={`p-2 cursor-pointer rounded-md ${selectedUnitGroup === group.name ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                      onClick={() => setSelectedUnitGroup(group.name)}
                    >
                      {group.name}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
            
            {/* Middle: Units */}
            <div className="w-1/3 border rounded-md overflow-auto">
              <div className="p-2 font-medium border-b">Units:</div>
              <ScrollArea className="h-[450px]">
                <div className="p-2">
                  {engineeringUnitGroups
                    .find(group => group.name === selectedUnitGroup)?.units
                    .map((unit) => (
                      <div 
                        key={unit.displayName}
                        className={`p-2 cursor-pointer rounded-md ${selectedUnit?.displayName === unit.displayName ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                        onClick={() => setSelectedUnit(unit)}
                      >
                        {unit.displayName}
                      </div>
                    ))}
                </div>
              </ScrollArea>
            </div>
            
            {/* Right: Unit Details */}
            <div className="w-1/3 border rounded-md overflow-auto">
              <div className="p-2 font-medium border-b">Display Name:</div>
              <div className="p-4 space-y-4">
                {selectedUnit ? (
                  <>
                    <Input value={selectedUnit.commonCode || ''} readOnly className="mb-4" />
                    
                    <div className="space-y-2">
                      <Label>Common Code:</Label>
                      <Input value={selectedUnit.commonCode || ''} readOnly />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Unit ID:</Label>
                      <Input value={selectedUnit.unitId || ''} readOnly />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Conversion:</Label>
                      <Input value={selectedUnit.conversion || ''} readOnly />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Description:</Label>
                      <textarea 
                        className="w-full h-24 p-2 border rounded-md resize-none" 
                        value={selectedUnit.description || ''}
                        readOnly
                      />
                    </div>
                  </>
                ) : (
                  <div className="text-center text-muted-foreground p-4">
                    Select a unit to view details
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setEngineeringUnitsDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={() => {
                if (selectedDeviceForUnits && selectedUnit) {
                  // Update the device with the selected engineering unit
                  setDevices(prev => 
                    prev.map(d => d.id === selectedDeviceForUnits.id ? 
                      { ...d, engineeringUnits: selectedUnit.commonCode || selectedUnit.displayName } : 
                      d
                    )
                  );
                  setEngineeringUnitsDialogOpen(false);
                }
              }}
            >
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Group Dialog */}
      <Dialog open={addGroupDialogOpen} onOpenChange={setAddGroupDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Group</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="group-name">Name:</Label>
              <Input 
                id="group-name" 
                value={groupName} 
                onChange={(e) => {
                  setGroupName(e.target.value);
                }}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="node-id-namespace">Node ID Namespace:</Label>
              <Select 
                value={groupNodeIdNamespace} 
                onValueChange={setGroupNodeIdNamespace}
              >
                <SelectTrigger id="node-id-namespace" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {nodeIdNamespaceOptions.map((option) => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="node-id-type">Node ID Type:</Label>
              <Select 
                value={groupNodeIdType} 
                onValueChange={setGroupNodeIdType}
              >
                <SelectTrigger id="node-id-type" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {nodeIdTypeOptions.map((option) => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="group-id">ID:</Label>
              <Input 
                id="group-id" 
                value={groupName} 
                readOnly
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="node-id">Node ID:</Label>
              <div className="relative">
                <Input 
                  id="node-id" 
                  value={`ns=${groupNodeIdNamespace.split(' ')[0]};${groupNodeIdType.split(' ')[0]}=${groupName}`}
                  readOnly
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setAddGroupDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => {
              // Add the group to the devices list
              const newGroup = {
                id: `group-${Date.now()}`,
                name: groupName,
                nodeId: `ns=${groupNodeIdNamespace.split(' ')[0]};${groupNodeIdType.split(' ')[0]}=${groupName}`,
                dataType: "Double",
                engineeringUnits: "",
                browseName: groupName,
                displayName: groupName,
                description: "Group"
              };
              
              setDevices(prev => [...prev, newGroup]);
              setAddGroupDialogOpen(false);
              
              // Show success message
              toast({
                title: "Group Added",
                description: `Added group ${groupName}`,
              });
            }}>OK</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </form>
  )
}
