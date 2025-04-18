
import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Circle, CircleDot, Dribbble, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { SportCategory } from "@/data/sportsData";

interface SportsSidebarProps {
  categories: SportCategory[];
  activeSport: string;
  activeCountry?: string;
  activeLeague?: string;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

const SportIcon = ({ sportId }: { sportId: string }) => {
  switch (sportId) {
    case 'football':
      return <CircleDot className="h-5 w-5" />;
    case 'basketball':
      return <Dribbble className="h-5 w-5" />;
    case 'tennis':
      return <Circle className="h-5 w-5" />;
    default:
      return <Circle className="h-5 w-5" />;
  }
};

export default function SportsSidebar({
  categories,
  activeSport,
  activeCountry,
  activeLeague,
  searchQuery,
  onSearchChange,
}: SportsSidebarProps) {
  return (
    <>
      <div className="p-4">
        <h3 className="text-lg font-semibold">Sports</h3>
        <div className="relative mb-2 mt-2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input 
            type="text" 
            placeholder="Search sports & leagues..." 
            className="pl-10 h-9"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>
      
      <Accordion type="multiple" defaultValue={[activeSport]}>
        {categories.map((category) => (
          <AccordionItem key={category.id} value={category.id}>
            <AccordionTrigger className="py-2 px-4 hover:no-underline">
              <div className="flex items-center gap-3">
                <SportIcon sportId={category.id} />
                <span>{category.name}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <SidebarMenu>
                <SidebarMenuItem key={`all-${category.id}`}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={activeSport === category.id && !activeCountry && !activeLeague}
                  >
                    <Link to={`/sports/${category.id}`}>
                      All {category.name}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                
                {category.countries.map((countryData) => (
                  <Collapsible key={countryData.id}>
                    <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-accent hover:text-accent-foreground rounded-md text-sm">
                      <span>{countryData.name}</span>
                      <ChevronRight className="h-4 w-4" />
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="pl-2">
                        <SidebarMenuItem key={`country-${countryData.id}`}>
                          <SidebarMenuButton 
                            asChild 
                            isActive={activeSport === category.id && activeCountry === countryData.id && !activeLeague}
                          >
                            <Link to={`/sports/${category.id}/${countryData.id}`}>
                              All {countryData.name} Leagues
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                        
                        {countryData.leagues.map((leagueData) => (
                          <SidebarMenuItem key={leagueData.id}>
                            <SidebarMenuButton 
                              asChild 
                              isActive={activeSport === category.id && activeLeague === leagueData.id}
                            >
                              <Link to={`/sports/${category.id}/${countryData.id}/${leagueData.id}`}>
                                {leagueData.name}
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        ))}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </SidebarMenu>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </>
  );
}
