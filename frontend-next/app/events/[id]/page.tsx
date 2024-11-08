"use client";

import Script from "next/script";

import Event from "@/components/events/event";
import { getEvent } from "@/services/mock/mock-data";
import { useAuth } from "@/providers/firebase-provider";

const UserEventPage = ({ params }: any) => {
  const event = getEvent(params.id);
  const auth = useAuth();

  return (
    <div>
      <Event event={event} />
      {process.env.NEXT_PUBLIC_TAWK_TO_ID && auth.user && (
        <Script
          dangerouslySetInnerHTML={{
            __html: `
            var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
            (function(){
            var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
            s1.async=true;
            s1.src='${process.env.NEXT_PUBLIC_TAWK_TO_ID}';
            s1.charset='UTF-8';
            s1.setAttribute('crossorigin','*');
            s0.parentNode.insertBefore(s1,s0);
            })();
          `,
          }}
          id="tawk-to-script"
          strategy="afterInteractive"
        />
      )}
    </div>
  );
};

export default UserEventPage;
