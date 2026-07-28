import AddressModal from "@/components/address-modal";
import PaymentModal from "@/components/payment-modal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Banknote, Briefcase } from "lucide-react";

export default function CheckoutPage() {
  return (
    <div className="flex gap-4 min-h-[calc(100vh-64px)] p-10">
      {/* 左側エリア */}
      <div className="max-w-3xl space-y-4 flex-1">
        <Card>
          <CardHeader>
            <CardTitle>配達の詳細</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="flex items-center gap-4">
              <Briefcase />
              <AddressModal />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>お支払い</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="flex items-center gap-4">
              <Banknote />
              <PaymentModal />
            </div>
          </CardContent>
        </Card>
      </div>
      {/* 右側エリア */}
      カート情報
    </div>
  );
}